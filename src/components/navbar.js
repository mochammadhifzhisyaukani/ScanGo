const navbar = document.getElementById('navbar');
navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg bg-body-tertiary rounded-5 mt-3 animate__animated animate__fadeIn">
  <div class="container-fluid">
    <a class="navbar-brand" href="/index.html">
        <img src="/src/assets/images/logo.jpeg" style="margin-left: 15px; height: 20px;">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav d-flex justify-content-end ms-auto">
        <a class="nav-link active text-center home" aria-current="page" href="/index.html">Home</a>     
        <a class="nav-link text-center" style="margin-right: 10px;" href="#">Guide</a>
        <a class="nav-link text-center" style="margin-right: 10px;" href="/src/js/structure/about.html">About</a>
        <a class="nav-link text-center" style="margin-right: 10px;" href="#">Company</a>
        <a class="nav-link text-center" style="margin-right: 10px;" href="#">Contact</a>
        <a class="nav-link text-center btn-signIn" href="/src/page/structure/signIn.html">Sign in</a>
      </div>
    </div>
  </div>
</nav>

`;

