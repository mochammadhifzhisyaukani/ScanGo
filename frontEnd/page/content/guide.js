const content = document.getElementById("content");
content.innerHTML = `
        <div class="partner container-sm text-center" style="margin-top: 8%;">
            <div class="changeTheme container-sm d-flex justify-content-center animate__animated animate__jackInTheBox" style="margin-top: 8%;"></div>
        </div>
<section class="py-5 px-3">
    <div class="container">

    <!-- Header -->
    <div class="text-center mb-5">
        <h1 class="section-title">Choose a Trail That<br>Fits You</h1>
        <p class="section-subtitle mt-3">
        Whether you're just starting out or chasing summits, find trails tailored to your experience
        </p>
    </div>

    <!-- Cards Grid -->
    <div class="row g-4 justify-content-center">

        <!-- Card 1 -->
        <div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('ganti video', 'GANTI_NAMA_TRAIL')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='https://placehold.co/600x400/a8d5a2/ffffff?text=gambar'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle">
            <i class="bi bi-play-fill"></i>
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level">GANTI_LEVEL</span>
        <p class="trail-name">GANTI_NAMA_TRAIL</p>
        <p class="trail-desc">GANTI_DESKRIPSI</p>
        <div class="trail-stat"><i class="bi bi-triangle"></i> GANTI_ELEVASI m elevation gain</div>
        <div class="trail-stat"><i class="bi bi-arrow-left-right"></i> GANTI_JARAK km trail length</div>
    </div>
    </div>
</div>

<div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('GANTI_PATH_VIDEO.mp4', 'GANTI_NAMA_TRAIL')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='https://placehold.co/600x400/a8d5a2/ffffff?text=Trail'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle"> 
            <i class="bi bi-play-fill"></i>
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level">GANTI_LEVEL</span>
        <p class="trail-name">GANTI_NAMA_TRAIL</p>
        <p class="trail-desc">GANTI_DESKRIPSI</p>
        <div class="trail-stat"><i class="bi bi-triangle"></i> GANTI_ELEVASI m elevation gain</div>
        <div class="trail-stat"><i class="bi bi-arrow-left-right"></i> GANTI_JARAK km trail length</div>
    </div>
    </div>
</div>
<div class="col-12 col-sm-10 col-md-6 col-lg-4">
    <div class="trail-card" onclick="openVideo('GANTI_PATH_VIDEO.mp4', 'GANTI_NAMA_TRAIL')">
    <div class="trail-thumb">
        <img src="GANTI_PATH_GAMBAR.jpg"
            onerror="this.src='https://placehold.co/600x400/a8d5a2/ffffff?text=Trail'"
            alt="GANTI_NAMA_TRAIL">
        <div class="play-overlay">
        <div class="play-btn-circle">
            <i class="bi bi-play-fill"></i>
        </div>
        </div>
    </div>
    <div class="trail-body">
        <span class="badge-level">GANTI_LEVEL</span>
        <p class="trail-name">GANTI_NAMA_TRAIL</p>
        <p class="trail-desc">GANTI_DESKRIPSI</p>
        <div class="trail-stat"><i class="bi bi-triangle"></i> GANTI_ELEVASI m elevation gain</div>
        <div class="trail-stat"><i class="bi bi-arrow-left-right"></i> GANTI_JARAK km trail length</div>
    </div>
    </div>
</div>
    </div>

    <!-- CTA -->
    <div class="text-center mt-5">
        <button class="btn-adventure">Find More Adventures</button>
    </div>
</div>
</section>
<!-- ===================== VIDEO MODAL ===================== -->
<div class="modal fade" id="videoModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
        <div class="modal-header">
        <h6 class="modal-title mb-0" id="videoModalLabel">Trail Video</h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
            <iframe id="modalVideo"
            src=""
            style="position:absolute;top:0;left:0;width:100%;height:100%;"
            allow="autoplay; fullscreen"
            allowfullscreen
            frameborder="0">
            </iframe>
        </div>
        </div>
    </div>
    </div>
</div>
`

