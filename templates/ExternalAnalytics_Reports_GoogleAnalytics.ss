<div class="ss-ga-report" $AttributesHTML>
    <div id="ss-ga-report--authenticator"></div>

    <div id="ss-ga-report--view-selector"></div>

    <% if $Metrics %>
    <div class="ss-ga-report--metrics processing">
        <% loop $Metrics %>
        <div class="ss-ga-report--metrics-summary">
            <h3>$Title</h3>

                <% loop $Values %>
                    <div class="ss-ga-report--metric processing">
                        $Title <strong class="ss-ga-report--metric-value" id="ss-ga-report--metric-value--{$ID}"></strong>
                    </div>
                <% end_loop %>
        </div>
        <% end_loop %>
    </div>
    <% end_if %>

    <% if $Charts %>
    <div class="ss-ga-report--charts processing">
        <% loop $Charts %>
        <div class="ss-ga-report--chart processing ss-ga-report--chart_{$Type}">
            <h3>$Title</h3>
            <div id="ss-ga-report--chart--{$ID}"></div>
        </div>
        <% end_loop %>
    </div>
    <% end_if %>
</div>