fn main() {
  println!("cargo:rustc-env=RUST_LOG=debug");
  println!("cargo:rustc-env=ENV=development");
  tauri_build::build()
}
