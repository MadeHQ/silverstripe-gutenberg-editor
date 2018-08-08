<div class="inline-images">
    <% loop $Images %>
        <img src="{$Image.Size($Height, $Width).Crop('fill')}" />
    <% end_loop %>
</div>
