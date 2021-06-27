mod flask;
use std::collections::{ HashSet, BTreeMap };
pub(crate) use flask::{ Flasks };
use std::hash::{ Hash, Hasher };

#[derive(Clone)]
struct Viewed {
    steps: Vec<(usize, usize)>,
    state: Flasks,
}

impl Hash for Viewed {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.state.hash(state);
    }
}
impl PartialEq for Viewed {
    fn eq(&self, other: &Self) -> bool {
        self.state == other.state
    }
}
impl Eq for Viewed {}
struct Front(BTreeMap<u16, Vec<Viewed>>);

impl Front {
    fn set(&mut self, weight: u16, viewed: Viewed) {
        match self.0.get_mut(&weight) {
            Some(w) => { w.push(viewed); },
            None => { self.0.insert(weight, vec![viewed]); },
        };
    }

    fn pop_first(&mut self) -> Option<Viewed> {
        match self.0.first_entry() {
            Some(mut w) => {
                if w.get().is_empty() {
                    self.0.pop_first();
                    self.pop_first()
                } else {
                    w.get_mut().pop()
                }
            }
            None => None
        }
    }

    fn len(&mut self) -> usize {
        self.0.iter().map(|v| v.1.len()).sum()
    }
}

pub(crate) fn search(flasks: &Flasks) -> Option<Vec<(usize, usize)>> {
    let mut front: Front = Front(BTreeMap::new());
    front.set(flasks.weight(), Viewed{ state: flasks.clone(), steps: Vec::new()});
    let mut viewed: HashSet<Viewed> = HashSet::new();
    let mut i = 0;
    while let Option::Some(Viewed{ state, steps }) = front.pop_first() {
        if i % 1000 == 100 {
            println!("{}: {} {}", i, front.len(), steps.len());
        }
        i += 1;
        for step in state.pours() {
            let mut new_steps = steps.clone();
            new_steps.push(step);
            let addition = Viewed {
                state: {
                    let mut next = state.clone();
                    next.pour(step.0, step.1);
                    next
                },
                steps: new_steps,
            };
            if !viewed.contains(&addition) {
                viewed.insert(addition.clone());
                let weight = addition.state.weight();
                if weight != 0 {
                    front.set(addition.state.weight(), addition);
                } else {
                    return Some(addition.steps);
                }
            }
        }
    }
    Option::None
}

pub(crate) fn get_step_state(data: &Flasks, steps: &Vec<(usize, usize)>, step_id: usize) -> Flasks {
    let mut result = data.clone();
    for step_id in 0..step_id {
        let (from, to) = steps[step_id];
        result.pour(from, to);
    }
    result
}
