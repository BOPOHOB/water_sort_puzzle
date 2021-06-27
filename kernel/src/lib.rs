#![feature(map_first_last)]
mod utils;

use wasm_bindgen::prelude::*;
pub mod solver;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn result_or_null<T>(reuslt: Result<JsValue, T>) -> JsValue {
    match reuslt {
        Ok(r) => r,
        Err(_) => JsValue::NULL
    }
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);
}

#[wasm_bindgen]
pub fn search(flasks: JsValue) -> JsValue {
    let flasks: solver::Flasks = match flasks.into_serde() {
        Ok(flasks) => flasks,
        Err(err) => {
            log(format!("{:?}", err).as_str());
            unreachable!()
        }
    };
    result_or_null(JsValue::from_serde(&solver::search(&flasks)))
}

#[wasm_bindgen]
pub fn get_step(flasks: JsValue, steps: JsValue) -> JsValue {
    let steps: Vec<(usize, usize)> = match steps.into_serde() {
        Ok(steps) => steps,
        Err(err) => {
            log(format!("{:?}", err).as_str());
            unreachable!()
        }
    };
    result_or_null(JsValue::from_serde(&solver::get_step_state(&flasks.into_serde().unwrap(), &steps, steps.len())))
}
