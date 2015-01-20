(function (w, d, s, g, js, fs) {
    g = w.gapi || (w.gapi = {});
    g.analytics = {q: [], ready: function (f) {
        this.q.push(f);
    }};
    js = d.createElement(s);
    fs = d.getElementsByTagName(s)[0];
    js.src = 'https://apis.google.com/js/platform.js';
    fs.parentNode.insertBefore(js, fs);
    js.onload = function () {
        g.load('analytics');
    };
}(window, document, 'script'));


(function ($) {

    $.entwine('ss', function ($) {

        $('.ss-ga-report').entwine({
            onmatch: function () {
                this.initialise();
            },
            initialise: function () {
                if (this.hasClass('ss-ga-report--initialised')) return;

                var $this = this;

                $this.addClass('ss-ga-report--initialised');

                gapi.analytics.ready(function () {
                    var accessToken = $this.data('accessToken'),
                        accessTokenUrl = $this.data('accessTokenUrl'),
                        clientId = $this.data('clientId'),
                        accountId = $this.data('accountId'),
                        fn = function () {
                            $this.find('.ss-ga-report--metrics,.ss-ga-report--charts').removeClass('processing');

                            var statistics = $this.data('metrics'),
                                charts = $this.data('charts'),
                                statOptions = {
                                    query: {}
                                },
                                chartOptions = {
                                    query: {},
                                    chart: {
                                        type: 'TABLE',
                                        options: {
                                            width: '100%'
                                        }
                                    }
                                },
                                timeout = 0,
                                timeoutLimit = 1000,
                                saved = [];

                            if (accountId) {
                                statOptions.query.ids = chartOptions.query.ids = ['ga:' + accountId];
                            }

                            for (var stats_i = 0; stats_i < statistics.length; stats_i++) {
                                var containers = [],
                                    stats_fn = function (report) {
                                        setTimeout(function () {
                                            report.execute();
                                            timeout++;
                                        }, timeout * timeoutLimit);
                                    },
                                    report = new gapi.analytics.report.Data($.extend(true, {}, statOptions, {
                                        query: {
                                            metrics: $.map(statistics[stats_i],function (value, key) {
                                                return key;
                                            }).join(',')
                                        }
                                    }));

                                (function (stats) {
                                    report.on('success', function (response) {
                                        if (response && response.hasOwnProperty('totalsForAllResults')) {
                                            for (var metric in response.totalsForAllResults) {
                                                if (response.totalsForAllResults.hasOwnProperty(metric) && stats.hasOwnProperty(metric)) {
                                                    if (stats[metric].hasOwnProperty('type')) {
                                                        if (stats[metric].type == 'percentage') {
                                                            response.totalsForAllResults[metric] = parseFloat(response.totalsForAllResults[metric]).toFixed(2);
                                                            response.totalsForAllResults[metric] += '%';
                                                        }
                                                        else if (stats[metric].type == 'money') {
                                                            response.totalsForAllResults[metric] = parseFloat(response.totalsForAllResults[metric]).toFixed(2);
                                                            response.totalsForAllResults[metric] = '$' + response.totalsForAllResults[metric];
                                                        }
                                                        else if (stats[metric].type == 'time') {
                                                            response.totalsForAllResults[metric] = parseFloat(response.totalsForAllResults[metric]).toFixed(2);
                                                            response.totalsForAllResults[metric] = response.totalsForAllResults[metric] + ' seconds';
                                                        }
                                                        else if (stats[metric].type == 'int') {
                                                            response.totalsForAllResults[metric] = Math.round(parseFloat(response.totalsForAllResults[metric]));
                                                        }
                                                    }

                                                    $(stats[metric].container).text(response.totalsForAllResults[metric]).parent().removeClass('processing');
                                                    containers.push(stats[metric].container);
                                                }
                                            }
                                        }
                                    });
                                })(statistics[stats_i]);

                                (function (stats_fn, report) {
                                    report.on('error', function (response) {
                                        console.log(response);
                                        if (response && response.hasOwnProperty('error') && response.error.hasOwnProperty('code') && response.error.code == 403) {
                                            timeout = 1;
                                            stats_fn(report);
                                        }
                                    });
                                })(stats_fn, report);

                                saved.push({
                                    containers: containers.join(','),
                                    item: report
                                });

                                if (accountId)
                                    stats_fn(report);
                            }

                            for (var charts_i = 0; charts_i < charts.length; charts_i++) {
                                var chart = new gapi.analytics.googleCharts.DataChart($.extend(true, {}, chartOptions, charts[charts_i])),
                                    charts_fn = function (chart) {
                                        setTimeout(function () {
                                            chart.execute();
                                            $('#' + chart.qa.chart.container).parent().removeClass('processing');
                                            timeout++;
                                        }, timeout * timeoutLimit);
                                    };

                                (function (charts_fn, chart) {
                                    chart.on('error', function (response) {
                                        if (response && response.hasOwnProperty('error') && response.error.hasOwnProperty('code') && response.error.code == 403) {
                                            timeout = 1;
                                            charts_fn(chart);
                                        }
                                    });
                                })(charts_fn, chart);

                                saved.push({
                                    containers: '#' + chart.qa.chart.container,
                                    item: chart
                                });

                                if (accountId)
                                    charts_fn(chart);
                            }

                            if (!accountId) {
                                var selector = new gapi.analytics.ViewSelector({
                                    container: 'ss-ga-report--view-selector'
                                });

                                selector.on('change', function (ids) {
                                    timeout = 0;

                                    for (var saved_i = 0; saved_i < saved.length; saved_i++) {
                                        (function (saved_i) {
                                            setTimeout(function () {
                                                saved[saved_i].item.set({query: {ids: ids}}).execute();
                                                $(saved[saved_i].containers).parent().removeClass('processing');
                                                timeout++;
                                            }, timeout * timeoutLimit);
                                        })(saved_i);
                                    }
                                });

                                selector.execute();
                            }
                        },
                        authorize = {
                            container: 'ss-ga-report--authenticator',
                            clientid: clientId
                        };

                    if (accessToken && accessToken.access_token) {
                        authorize.serverAuth = {
                            access_token: accessToken.access_token
                        };
                    }

                    gapi.analytics.auth.authorize(authorize);

                    if (gapi.analytics.auth.isAuthorized())
                        fn();

                    gapi.analytics.auth.on('error', function (error) {
                    });

                    gapi.analytics.auth.on('success', function (response) {
                        if (response && response.access_token) {
                            if (response['g-oauth-window'])
                                delete response['g-oauth-window'];

                            $.post(accessTokenUrl, response);
                        }

                        fn();
                    });
                });
            }
        });
    });
})(jQuery);