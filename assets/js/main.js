/* ==========================================================================
   jQuery plugin settings and other scripts
   ========================================================================== */

$(document).ready(function () {
  // detect OS/browser preference
  const browserPref = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  
  
  // Set the theme on page load or when explicitly called
  var setTheme = function (theme) {
    const use_theme =
      theme ||
      localStorage.getItem("theme") ||
      $("html").attr("data-theme") ||
      browserPref;

    if (use_theme === "dark") {
      $("html").attr("data-theme", "dark");
      $("#theme-icon").removeClass("fa-sun").addClass("fa-moon");
    } else if (use_theme === "light") {
      $("html").removeAttr("data-theme");
      $("#theme-icon").removeClass("fa-moon").addClass("fa-sun");
    }
  };

  setTheme();

  // if user hasn't chosen a theme, follow OS changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  // Toggle the theme manually
  var toggleTheme = function () {
    const current_theme = $("html").attr("data-theme");
    const new_theme = current_theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", new_theme);
    setTheme(new_theme);
  };

  $('#theme-toggle').on('click', toggleTheme);

  // These should be the same as the settings in _variables.scss
  const scssLarge = 925; // pixels

  // Sticky footer
  var bumpIt = function () {
    $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
  },
    didResize = false;

  bumpIt();

  $(window).resize(function () {
    didResize = true;
  });
  setInterval(function () {
    if (didResize) {
      didResize = false;
      bumpIt();
    }
  }, 250);

  // FitVids init
  $(".page__content, article").fitVids();

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").fadeToggle("fast", function () { });
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Restore the follow menu if toggled on a window resize
  jQuery(window).on('resize', function () {
    if ($('.author__urls.social-icons').css('display') == 'none' && $(window).width() >= scssLarge) {
      $(".author__urls").css('display', 'block')
    }
  });

  // init smooth scroll, this needs to be slightly more than then fixed masthead height
  $("a").smoothScroll({ 
    offset: -75, // needs to match $masthead-height
    preventDefault: false,
  }); 

  // add lightbox class to all image links
  // Add "image-popup" to links ending in image extensions,
  // but skip any <a> that already contains an <img>
  $("a[href$='.jpg'],\
  a[href$='.jpeg'],\
  a[href$='.JPG'],\
  a[href$='.png'],\
  a[href$='.gif'],\
  a[href$='.webp']")
      .not(':has(img)')
      .addClass("image-popup");

  // 1) Wrap every <p><img> (except emoji images) in an <a> pointing at the image, and give it the lightbox class
  $('p > img').not('.emoji').each(function() {
    var $img = $(this);
    // skip if it’s already wrapped in an <a.image-popup>
    if ( ! $img.parent().is('a.image-popup') ) {
      $('<a>')
        .addClass('image-popup')
        .attr('href', $img.attr('src'))
        .insertBefore($img)   // place the <a> right before the <img>
        .append($img);        // move the <img> into the <a>
    }
  });

  // Magnific-Popup options
  $(".image-popup").magnificPopup({
    type: 'image',
    tLoading: 'Loading image #%curr%...',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      tError: '<a href="%url%">Image #%curr%</a> could not be loaded.',
    },
    removalDelay: 500, // Delay in milliseconds before popup is removed
    // Class that is added to body when popup is open.
    // make it unique to apply your CSS animations just to this exact popup
    mainClass: 'mfp-zoom-in',
    callbacks: {
      beforeOpen: function () {
        // just a hack that adds mfp-anim class to markup
        this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
      }
    },
    closeOnContentClick: true,
    midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
  });

  // const bionicSelectors = 'h1, h2, h3, p, li, .content p, .content li, .content div, .content span, .page__content p, .page__content li, .page__content div, .page__content span, .page__content ol, article p, article li, article div, article span, article p, article li, article div, article span';
  const bionicSelectors = 'h1, h2, h3, p, li';
  const BIONIC_DELTA_WEIGHT     = 200;  // 每个 <b> 额外加粗值
  const BIONIC_MAX_WEIGHT       = 900;  // 加粗上限
  const BIONIC_COLOR_SHIFT      = -1;    // 若想微调颜色设 0–1；完全不调色就保持 0

  /* ---------- 缓存 ---------- */
  const originalContentMap = new Map();   // 保存启用前的原始 HTML
  const originalWeightMap  = new WeakMap();
  const originalColorMap   = new WeakMap();

  /* ---------- 1. 把纯文本节点替换为加粗前缀 ---------- */
  function applyBionicToElementInternal(el) {
    const $el = $(el);
    if (
      $el.closest('pre, code, .highlight, a').length ||
      $el.data('bionic-applied') === 'true'
    ) return;

    if (window.getComputedStyle(el).fontStyle === 'italic') return;

    $el.contents().each(function () {
      if (this.nodeType === 3) {                              // 文本
        const txt = this.nodeValue;
        if (txt.trim()) $(this).replaceWith(textVide.textVide(txt));
      } else {                                                // 元素，递归
        applyBionicToElementInternal(this);
      }
    });

    $el.data('bionic-applied', 'true');
  }

  /* ---------- 2. 加粗 / 恢复 <b> 字重 ---------- */
  function boostWeight(node, delta = BIONIC_DELTA_WEIGHT) {
    let w = window.getComputedStyle(node).fontWeight;
    if (w === 'normal') w = 400;
    else if (w === 'bold') w = 700;
    else w = parseInt(w, 10);

    if (!isNaN(w)) {
      originalWeightMap.set(node, w);
      node.style.fontWeight = Math.min(w + delta, BIONIC_MAX_WEIGHT);
    }
  }

  function restoreWeight(node) {
    if (originalWeightMap.has(node)) {
      node.style.fontWeight = originalWeightMap.get(node);
    } else {
      node.style.removeProperty('font-weight');
    }
  }

  /* ---------- 3. （可选）颜色微调 ---------- */
  function shiftColor(node, ratio = BIONIC_COLOR_SHIFT) {
    if (ratio === 0) return;

    const col = window.getComputedStyle(node).color;                // rgb(r,g,b)
    const m = col.match(/\d+/g);
    if (!m) return;
    const [r, g, b] = m.map(Number);

    // 背景简单判断：亮背景 → 往黑走；暗背景 → 往白走
    const toward = (r + g + b) > 382 ? 0 : 255;
    const newRGB = [r, g, b].map(v =>
      Math.round(v * (1 - ratio) + toward * ratio)
    );
    originalColorMap.set(node, col);
    node.style.color = `rgb(${newRGB.join(',')})`;
  }

  function restoreColor(node) {
    if (originalColorMap.has(node)) {
      node.style.color = originalColorMap.get(node);
    } else {
      node.style.removeProperty('color');
    }
  }

  /* ---------- 4. 批量应用 / 恢复 Tweaks ---------- */
  function applyBionicTweaks() {
    $('html[data-bionic-reading="enabled"] b').each(function () {
      boostWeight(this);
      shiftColor(this);
    });
  }

  function revertBionicTweaks() {
    $('b').each(function () {
      restoreWeight(this);
      restoreColor(this);
    });
  }

  /* ---------- 5. 首次存档原文 ---------- */
  $(bionicSelectors).each(function () {
    if (!originalContentMap.has(this)) originalContentMap.set(this, $(this).html());
  });

  /* ---------- 6. 应用 & 撤销 ---------- */
  function applyBionicReadingToPage() {
    $(bionicSelectors).each(function () {
      applyBionicToElementInternal(this);
    });
    console.log('Bionic Reading Applied');
  }

  function revertBionicReadingOnPage() {
    $(bionicSelectors).each(function () {
      if (originalContentMap.has(this)) {
        $(this).html(originalContentMap.get(this))
              .data('bionic-applied', 'false');
      }
    });
    console.log('Bionic Reading Reverted');
  }

  /* ---------- 7. 开关入口 ---------- */
  function setBionicReading(status) {
    if (status === 'enabled') {
      applyBionicReadingToPage();
      applyBionicTweaks();
      $('html').attr('data-bionic-reading', 'enabled');
      $('#bionic-reading-toggle').addClass('active');
      localStorage.setItem('bionicReading', 'enabled');
    } else {
      revertBionicReadingOnPage();
      revertBionicTweaks();
      $('html').attr('data-bionic-reading', 'disabled');
      $('#bionic-reading-toggle').removeClass('active');
      localStorage.setItem('bionicReading', 'disabled');
    }
  }

  /* ---------- 8. 初始化 & 绑定 ---------- */
  const currentBionicPref = localStorage.getItem('bionicReading');
  setBionicReading(currentBionicPref === 'enabled' ? 'enabled' : 'disabled');

  $('#bionic-reading-toggle').on('click', () => {
    const cur = $('html').attr('data-bionic-reading');
    setBionicReading(cur === 'enabled' ? 'disabled' : 'enabled');
  });
});