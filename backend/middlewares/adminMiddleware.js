const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role.trim().toLowerCase() !== "admin") {
    showToast("Akses ditolak! Halaman ini khusus untuk Admin.", "danger")
    Swal.fire({
      title: "Login Gagal",
      icon: "error",
      draggable: true,
      customClass: {
        popup: "sweetalert-popup",
        confirmButton: "sweetalert-btn-error",
      },

      buttonsStyling: false,
    });
  }
};

module.exports = verifyAdmin;