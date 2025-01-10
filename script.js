console.log("JavaScript berhasil terhubung!");

// Event Listener untuk tombol bahasa
document.getElementById('en').addEventListener('click', () => {
  // Ganti ke bahasa Inggris
  document.documentElement.lang = "en";
  console.log('Bahasa Inggris dipilih');
});

document.getElementById('id').addEventListener('click', () => {
  // Ganti ke bahasa Indonesia
  document.documentElement.lang = "id";
  console.log('Bahasa Indonesia dipilih');
});
