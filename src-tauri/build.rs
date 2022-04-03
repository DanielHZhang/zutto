fn main() {
  println!("cargo:rustc-env=ENV=development");
  tauri_build::build()
}
