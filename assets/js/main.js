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
  const bionicSelectors = '.page__content p, .page__content li, .article p, .article li, .archive p, .archive li';

  /* ---------- 1. 把纯文本节点替换为加粗前缀 ---------- */
  function applyBionicToElementInternal(el) {
    const $el = $(el);
    if (
      $el.closest('pre, code, .highlight, a').length ||
      $el.data('bionic-applied') === 'true' ||
      window.getComputedStyle(el).fontStyle === 'italic' ||  // 跳过斜体
      el.tagName === 'STRONG'
    ) return;

    $el.contents().each(function () {
      if (this.nodeType === 3) {               // 纯文本
        const txt = this.nodeValue;
        if (txt.trim()) $(this).replaceWith(textVide.textVide(txt));
      } else {                                 // 继续递归
        applyBionicToElementInternal(this);
      }
    });

    $el.attr('data-bionic-applied', 'true');        // 供 CSS 识别
  }

  /* ---------- 2. 记录原始 HTML，用于撤销 ---------- */
  const originalContentMap = new Map();
  $(bionicSelectors).each(function () {
    if (!originalContentMap.has(this))
      originalContentMap.set(this, $(this).html());
  });

  /* ---------- 3. 应用 & 撤销 ---------- */
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
              .removeAttr('data-bionic-applied');
      }
    });
    console.log('Bionic Reading Reverted');
  }

  /* ---------- 4. 开关入口（CSS 负责动画） ---------- */
  function setBionicReading(status) {
    if (status === 'enabled') {
      applyBionicReadingToPage();
      $('html').attr('data-bionic-reading', 'enabled');
      $('#bionic-reading-toggle').addClass('active');
      localStorage.setItem('bionicReading', 'enabled');
    } else {
      $('html').attr('data-bionic-reading', 'disabled');
      const cssTime = getComputedStyle(document.documentElement)
                     .getPropertyValue('--bionic-time')
                     .trim() || '500ms';

      /* 把 "500ms" / "0.35s" 转成毫秒数 */
      const timeMs = cssTime.endsWith('ms')
        ? parseFloat(cssTime)
        : parseFloat(cssTime) * 1000;

      setTimeout(() => {
        revertBionicReadingOnPage();                     // 现在才还原
      }, timeMs);
      $('#bionic-reading-toggle').removeClass('active');
      localStorage.setItem('bionicReading', 'disabled');
    }
  }

  /* ---------- 5. 初始化 & 绑定 ---------- */
  setBionicReading(
    localStorage.getItem('bionicReading') === 'enabled' ? 'enabled' : 'disabled'
  );

  $('#bionic-reading-toggle').on('click', () => {
    const cur = $('html').attr('data-bionic-reading');
    setBionicReading(cur === 'enabled' ? 'disabled' : 'enabled');
  });
});