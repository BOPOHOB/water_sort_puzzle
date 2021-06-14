/*
#636466 - gray
#2e6337 - green
#7f9530 - lime
#67a1e0 - blue
#682f8e - purple
#392ebb - azure
#d8677b - blush
#b5392d - red
#81d486 - aqua
#774b1a - brown
#db8f51 - coral
#ecda6c - yellow
*/

#[derive(PartialEq)]
enum Liquids {
    Empty = 0,
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

struct Flask([Liquids; 4]);

impl Flask {
    fn empty() -> Flask {
        Flask([
            Liquids::Empty,
            Liquids::Empty,
            Liquids::Empty,
            Liquids::Empty,
        ])
    }

    fn weight(&self) -> u16 {
        let Flask(t) = self;
        let mut result = 0;
        for index1 in 0..t.len() {
            for index2 in (index1 + 1)..t.len() {
                result += if t[index1] != t[index2] { 10 } else { 0 }
            }
        }
        if result == 0 { 0 } else { result + 70 }
    }
}

struct Flasks([Flask; 14]);

impl Flasks {
    fn weight(&self) -> u16 {
        self.0.map(|flask| flask.weight()).sum()
    }
}

fn main() {
    let data = Flasks([
        Flask([
            Liquids::Gray,
            Liquids::Green,
            Liquids::Blue,
            Liquids::Lime,
        ]),
        Flask([
            Liquids::Red,
            Liquids::Blush,
            Liquids::Green,
            Liquids::Purple,
        ]),
        Flask([
            Liquids::Aqua,
            Liquids::Brown,
            Liquids::Gray,
            Liquids::Azure,
        ]),
        Flask([
            Liquids::Blue,
            Liquids::Lime,
            Liquids::Blue,
            Liquids::Brown,
        ]),
        Flask([
            Liquids::Gray,
            Liquids::Coral,
            Liquids::Coral,
            Liquids::Coral,
        ]),
        Flask([
            Liquids::Red,
            Liquids::Lime,
            Liquids::Brown,
            Liquids::Brown,
        ]),
        Flask([
            Liquids::Azure,
            Liquids::Yellow,
            Liquids::Red,
            Liquids::Aqua,
        ]),
        Flask([
            Liquids::Red,
            Liquids::Yellow,
            Liquids::Coral,
            Liquids::Gray,
        ]),
        Flask([
            Liquids::Purple,
            Liquids::Yellow,
            Liquids::Aqua,
            Liquids::Green,
        ]),
        Flask([
            Liquids::Purple,
            Liquids::Blue,
            Liquids::Yellow,
            Liquids::Azure,
        ]),
        Flask([
            Liquids::Lime,
            Liquids::Azure,
            Liquids::Aqua,
            Liquids::Blush,
        ]),
        Flask([
            Liquids::Blush,
            Liquids::Blush,
            Liquids::Green,
            Liquids::Purple,
        ]),
        Flask::empty(),
        Flask::empty(),
    ]);
    for flask in data.0 {
        println!("{}", flask.weight());
    }
    println!("whole weight {}", data.weight());
}