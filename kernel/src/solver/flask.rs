use serde::{Serialize, Deserialize};

#[derive(PartialEq, Eq, Clone, Copy, Debug, Hash, Serialize, Deserialize)]
pub enum Liquid {
    Empty,
    Gray,
    Green,
    Lime,
    Blue,
    Purple,
    Azure,
    Blush,
    Red,
    Aqua,
    Brown,
    Coral,
    Yellow,
}

#[derive(PartialEq, Eq, Clone, Debug, Hash, Serialize, Deserialize)]
pub struct Flask(pub [Liquid; 4]);

impl Flask {
    pub(crate) fn weight(&self) -> u16 {
        let Flask(liquids) = self;
        let mut result = 0;
        for i in 0..liquids.len() {
            for j in (i + 1)..liquids.len() {
                result += if liquids[i] != liquids[j] { 10 } else { 0 }
            }
        }
        if result == 0 { 0 } else { result + 70 }
    }

    fn top_liquid(&self) -> Liquid {
        for liquid in self.0.iter() {
            if *liquid != Liquid::Empty {
                return *liquid;
            }
        }
        Liquid::Empty
    }

    fn is_monocolor(&self) -> bool {
        let mut i = 0;
        while i < self.0.len() && self.0[i] == Liquid::Empty {
            i += 1;
        }
        if i == self.0.len() {
            return true
        }
        let color = self.0[i];
        while i < self.0.len() && self.0[i] == color {
            i += 1;
        }
        i == self.0.len()
    }

    /**
     * Возвращает пару признаков что во что можно влить.
    */
    pub(crate) fn can_pour(a: &Flask, b: &Flask) -> (bool, bool) {
        let a_top: Liquid = a.top_liquid();
        let b_top: Liquid = b.top_liquid();
        if a_top == Liquid::Empty && b_top == Liquid::Empty {
            return (false, false);
        }
        if a_top == Liquid::Empty {
            return (!b.is_monocolor(), false);
        }
        if b_top == Liquid::Empty {
            return (false, !a.is_monocolor());
        }
        if a_top == b_top {
            return (a.0[0] == Liquid::Empty, b.0[0] == Liquid::Empty);
        }
        (false, false)
    }

    pub(crate) fn pour(from: &mut Flask, to: &mut Flask) {
        let mut capacity: usize = 0;
        let len = to.0.len();

        while len > capacity && to.0[capacity] == Liquid::Empty {
            capacity += 1;
        }
        let mut poured = 0;
        while len > poured && from.0[poured] == Liquid::Empty {
            poured += 1;
        }
        while {
            if capacity == 0 || poured == len {
                return;
            }
            if capacity == len {
                true
            } else {
                let a_liquid = to.0[capacity];
                let b_liquid = from.0[poured];
                    a_liquid == b_liquid
            }
            } {
            capacity -= 1;
            assert!(to.0[capacity] == Liquid::Empty);
            to.0[capacity] = from.0[poured];
            from.0[poured] = Liquid::Empty;
            poured += 1;
        }
    }
}

#[derive(Debug)]
pub(crate) struct PoursIterator<'a> {
    flasks: &'a [Flask],
    i: usize,
    j: usize,
    k: bool,
    pours: Option<(bool, bool)>,
}

impl PoursIterator<'_> {
    pub(crate) fn new(flasks: &[Flask]) -> PoursIterator {
        PoursIterator {
            flasks,
            i: 0,
            j: 1,
            k: false,
            pours: Option::None,
        }
    }

    fn go_next(&mut self) {
        self.j += 1;
        if self.j >= self.flasks.len() {
            self.i += 1;
            self.j = self.i + 1;
        }
    }

    fn is_finished(&self) -> bool {
        self.j >= self.flasks.len()
    }
}

impl Iterator for PoursIterator<'_> {
    type Item = (usize, usize);
    fn next(&mut self) -> Option<(usize, usize)> {
        if let Option::Some(pours) = self.pours {
            if !self.k {
                self.k = true;
                if pours.0 {
                    return Option::Some((self.j, self.i));
                }
            }
            if self.k {
                self.k = false;
                self.pours = Option::None;
                let result = (self.i, self.j);
                self.go_next();
                if pours.1 {
                    return Option::Some(result);
                }
            }
        }
        if self.is_finished() {
            return Option::None
        }
        while {
            let a: &Flask = &self.flasks[self.i];
            let b: &Flask = &self.flasks[self.j];
            let pours = Flask::can_pour(a, b);
            self.pours = Option::Some(pours);
            !pours.0 && !pours.1
        } {
            self.go_next();
            if self.is_finished() {
                return Option::None;
            }
        }
        self.next()
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        return (0, Option::Some(self.flasks.len().pow(2) * 2))
    }
}

#[derive(PartialEq, Eq, Clone, Hash, Debug, Serialize, Deserialize)]
pub(crate) struct Flasks(pub(crate) [Flask; 14]);

impl Flasks {
    pub(crate) fn weight(&self) -> u16 {
        self.0.iter().map(|flask| flask.weight()).sum()
    }

    pub(crate) fn pours(&self) -> PoursIterator {
        PoursIterator::new(&self.0)
    }


    fn get_refs(&mut self, a: usize, b: usize) -> (&mut Flask, &mut Flask) {
        if a > b {
            let r = self.get_refs(b, a);
            return (r.1, r.0);
        }
        let (i, j) = self.0.split_at_mut(a + 1);
        (&mut i[a], &mut j[b - a - 1])
    }

    pub(crate) fn pour(&mut self, from: usize, to: usize) {
        let (from, to) = self.get_refs(from, to);
        Flask::pour(from, to);
    }
}
