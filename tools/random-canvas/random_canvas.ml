open General.Abbr
module Rdm = OCamlStandard.Random.State

(* http://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV *)
let hsv_to_rgb ~h ~s ~v =
  let c = v *. s in
  let h' = 3. *. h /. Fl.pi in
  let x = c *. (1. -. Fl.abs (Fl.modulo h' 2. -. 1.)) in
  let (r1, g1, b1) =
    if h' < 1. then (c, x, 0.)
    else if h' < 2. then (x, c, 0.)
    else if h' < 3. then (0., c, x)
    else if h' < 4. then (0., x, c)
    else if h' < 5. then (x, 0., c)
    else (c, 0., x)
  in
  let m = v -. c in
  let r = r1 +. m and g = g1 +. m and b = b1 +. m in
  (r, g, b)

module Make(C: JsOfOCairo.S) = struct
  module C = struct
    include C

    let set_source_hsv ctx ~h ~s ~v =
      let (r, g, b) = hsv_to_rgb ~h ~s ~v in
      set_source_rgb ctx ~r ~g ~b
  end

  let randomize ctx ~seed ~width ~height =
    let rdm = Rdm.make (seed |> Str.to_list |> Li.map ~f:Ch.to_int |> Li.to_array) in
    let float x y = x +. Rdm.float rdm (y -. x)
    and int x y = x + Rdm.int rdm (y - x) in
    C.set_source_hsv ctx ~h:(float 0. (2. *. Fl.pi)) ~s:(float 0. 1.) ~v:(float 0. 1.);
    C.paint ctx;
    IntRa.make (int 10 20)
    |> IntRa.iter ~f:(fun _ ->
      C.set_source_rgb ctx ~r:(float 0. 1.) ~g:(float 0. 1.) ~b:(float 0. 1.);
      C.move_to ctx ~x:(float 0. width) ~y:(float 0. height);
      C.line_to ctx ~x:(float 0. width) ~y:(float 0. height);
      C.stroke ctx
    )
end

module Made = Make(JsOfOCairo)

let () = Js.export "randomize_canvas" (fun config ->
  let canvas = JsOfOCairo.create config##.canvas
  and seed = Js.to_string config##.seed
  and width = config##.width
  and height = config##.height in
  Made.randomize canvas ~seed ~width ~height
)
