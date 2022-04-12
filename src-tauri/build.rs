fn main() {
  println!("cargo:rustc-env=RUST_LOG=debug");
  println!("cargo:rustc-env=ENV=development");
  // println!("cargo:rustc-env=ENV=production");
  tauri_build::build()
}
