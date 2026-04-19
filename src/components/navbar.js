const navbar = document.getElementById('navbar');
navbar.innerHTML = `
<nav class="navbar navbar-expand-lg navbar-dark w-100">
        <div class="container-sm">
            <a class="navbar-brand fw-bold text-black" href="/index.html" style="font-size: 20px;">ScanGo</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon bg-dark rounded-1"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto" id="myTab" role="tablist">
                    <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle text-black" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Product
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Scan Present</a></li>
            <li><a class="dropdown-item" href="#">Dashboard Student</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Setting Password Admin</a></li>
          </ul>
        </li>
                    <li class="nav-item">
                        <a class="nav-link text-black" href="#">Guide</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-black" href="#">About Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-black" href="#">Contact</a>
                    </li>
                </ul>

                <div class="d-flex gap-2">
                    <a href="#" class="btn btn-outline-dark rounded-5 btn-lg">Sign in</a>
                    <a href="#" class="btn btn-dark rounded-5 btn-lg">Sign up</a>
                </div>
            </div>
        </div>
    </nav>`;