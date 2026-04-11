const navbar = document.getElementById('navbar');
navbar.innerHTML = `
    <nav class="navbar navbar-expand-lg w-100">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">
        <img src="./src/assets/images/LogoScanGo.png" class="rounded" alt="logo navbar" style="height: 50px;">
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Product</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Guide</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Contact</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
`;