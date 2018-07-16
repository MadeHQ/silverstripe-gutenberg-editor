<div class="inline-gallery js-inline-gallery <% if $AlignLeft %> inline-gallery--align-left <% end_if %> <% if $AlignRight %> inline-gallery--align-right <% end_if %>" itemscope itemtype="http://schema.org/ImageGallery">
    <div class="inline-gallery__list  js-inline-gallery__list">
        <% loop $Images %>
            <div class="inline-gallery__item">
                <figure class="gallery-item o-figure" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject" data-width="{$Width}" data-height="{$Height}" data-large-src="{$Image.Size($Width, $Height)}" data-caption="{$Caption}" data-credit="{$Credit}">
                    <button class="gallery-item__link js-gallery-popup">
                        $Icon('expand', 'medium')
                    </button>
                    <div class="gallery-item__media u-ratio u-ratio--16-9">
                        <img class="gallery-item__image" itemprop="thumbnail" src="{$Image.Size($Up.Width, $Up.Height).Crop('fill')}" alt=""/>
                    </div>
                    <figcaption class="gallery-item__meta o-figure__meta">
                        <span class="gallery-item__slide-number"></span>

                        <% if Caption %>
                            <p itemprop="caption" class="gallery-item__caption o-figure__caption">
                                {$Caption}
                            </p>
                        <% end_if %>

                        <% if Credit %>
                            <span itemprop="credit" class="gallery-item__credit">
                                {$Credit}
                            </span>
                        <% end_if %>
                    </figcaption>
                </figure>

            </div>
        <% end_loop %>
    </div>


    <!-- Root element of PhotoSwipe. Must have class pswp. -->
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

        <!-- Background of PhotoSwipe.
             It's a separate element as animating opacity is faster than rgba(). -->
        <div class="pswp__bg"></div>

        <!-- Slides wrapper with overflow:hidden. -->
        <div class="pswp__scroll-wrap">

            <!-- Container that holds slides.
                PhotoSwipe keeps only 3 of them in the DOM to save memory.
                Don't modify these 3 pswp__item elements, data is added later on. -->
            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>

            <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
            <div class="pswp__ui pswp__ui--hidden">

                <div class="pswp__top-bar">

                    <!--  Controls are self-explanatory. Order can be changed. -->

                    <div class="pswp__counter"></div>

                    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                    <button class="pswp__button pswp__button--share" title="Share"></button>

                    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                    <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                    <!-- element will get class pswp__preloader--active when preloader is running -->
                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                          <div class="pswp__preloader__cut">
                            <div class="pswp__preloader__donut"></div>
                          </div>
                        </div>
                    </div>
                </div>

                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip"></div>
                </div>

                <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                </button>

                <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                </button>

                <div class="pswp__caption">
                    <div class="pswp__caption__center"></div>
                </div>

            </div>
        </div>
    </div>
</div>
