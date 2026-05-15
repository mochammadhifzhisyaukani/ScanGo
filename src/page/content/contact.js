// Whatsapp Form Submission
const contactForm = document.getElementById("contact");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const telepon = document.getElementById("tel").value;
    const pesan = document.getElementById("ulasan").value;

    if (!nama || !email || !telepon || !pesan) {
      alert("Harap isi semua field sebelum submit!");
      return;
    }

    const nomorWA = "6289517354572";
    const teks = `Halo Min, ada pesan baru dari website: ScanGo\n\nNama: ${nama}\nEmail: ${email}\nNomor Telephone: ${telepon}\nPesan: ${pesan}`;
    const url =
      "https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(teks);

    window.open(url, "_blank");

    alert("Pesan Anda akan diarahkan ke WhatsApp 🚀");
    this.reset();
  });
}
