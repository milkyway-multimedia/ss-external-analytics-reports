(function(w,d,s,g,js,fs){
    g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(f){this.q.push(f);}};
    js=d.createElement(s);fs=d.getElementsByTagName(s)[0];
    js.src='https://apis.google.com/js/platform.js';
    fs.parentNode.insertBefore(js,fs);js.onload=function(){g.load('analytics');};
}(window,document,'script'));


(function($) {

    $.entwine('ss', function($){

        $('#ss-ga-report--authenticator').entwine({
            onmatch: function() {
                this.initialise();
            },
            initialise: function() {
                if(this.hasClass('ss-ga-report--initialised')) return;

                this.addClass('ss-ga-report--initialised');

                    gapi.analytics.ready(function() {
                        var fn = function() {
                                $('.ss-ga-report--metrics,.ss-ga-report--charts').removeClass('processing');

                                var statistics = [
                                        {
                                            'ga:users': {
                                                container: '#ss-ga-report--metric-value--users'
                                            },
                                            'ga:newUsers': {
                                                container: '#ss-ga-report--metric-value--newUsers'
                                            },
                                            'ga:pageviews': {
                                                container: '#ss-ga-report--metric-value--pageviews'
                                            },
                                            'ga:bounceRate': {
                                                container: '#ss-ga-report--metric-value--bounceRate',
                                                type: 'percentage'
                                            },
                                            'ga:avgSessionDuration': {
                                                container: '#ss-ga-report--metric-value--avgSessionDuration',
                                                type: 'time'
                                            },
                                            'ga:pageviewsPerSession': {
                                                container: '#ss-ga-report--metric-value--pageviewsPerSession',
                                                type: 'int'
                                            },
                                            'ga:avgTimeOnPage': {
                                                container: '#ss-ga-report--metric-value--avgTimeOnPage',
                                                type: 'time'
                                            },
                                            'ga:avgPageLoadTime': {
                                                container: '#ss-ga-report--metric-value--avgPageLoadTime',
                                                type: 'time'
                                            },
                                            'ga:socialInteractions': {
                                                container: '#ss-ga-report--metric-value--socialInteractions'
                                            }
                                        },
                                        {
                                            'ga:avgServerConnectionTime': {
                                                container: '#ss-ga-report--metric-value--avgServerConnectionTime',
                                                type: 'time'
                                            },
                                            'ga:avgServerResponseTime': {
                                                container: '#ss-ga-report--metric-value--avgServerResponseTime',
                                                type: 'time'
                                            },
                                            'ga:exceptions': {
                                                container: '#ss-ga-report--metric-value--exceptions'
                                            }
                                        },
                                        {
                                            'ga:impressions': {
                                                container: '#ss-ga-report--metric-value--adwords_impressions'
                                            },
                                            'ga:cpc': {
                                                container: '#ss-ga-report--metric-value--adwords_cpc',
                                                type: 'money'
                                            },
                                            'ga:ctr': {
                                                container: '#ss-ga-report--metric-value--adwords_ctr',
                                                type: 'percentage'
                                            }
                                        }
                                    ],
                                    charts = [
                                        {
                                            query: {
                                                metrics: 'ga:sessions',
                                                dimensions: 'ga:date'
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--traffic',
                                                type: 'LINE'
                                            }
                                        },
                                        {
                                            query: {
                                                metrics: 'ga:sessions',
                                                dimensions: 'ga:mobileDeviceInfo',
                                                segment: 'gaid::-14',
                                                'max-results': 5
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--mobile',
                                                type: 'PIE'
                                            }
                                        },
                                        {
                                            query: {
                                                metrics: 'ga:sessions',
                                                dimensions: 'ga:country',
                                                sort: '-ga:sessions'
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--countries',
                                                type: 'GEO'
                                            }
                                        },
                                        {
                                            query: {
                                                metrics: 'ga:pageviews',
                                                dimensions: 'ga:browser',
                                                sort: '-ga:pageviews',
                                                'max-results': 5
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--browser',
                                                type: 'PIE'
                                            }
                                        },
                                        {
                                            query: {
                                                dimensions: 'ga:medium',
                                                metrics: 'ga:sessions',
                                                sort: '-ga:sessions'
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--trafficSources',
                                                type: 'PIE'
                                            }
                                        },
                                        {
                                            query: {
                                                dimensions: 'ga:userType',
                                                metrics: 'ga:sessions'
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--loyalty',
                                                type: 'PIE'
                                            }
                                        },
                                        {
                                            query: {
                                                dimensions: 'ga:dayOfWeekName',
                                                metrics: 'ga:users'
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--weekly',
                                                type: 'LINE'
                                            }
                                        },
                                        {
                                            query: {
                                                dimensions: 'ga:pagePath',
                                                metrics: 'ga:pageviews,ga:uniquePageviews,ga:timeOnPage,ga:bounces,ga:entrances,ga:exits',
                                                sort: '-ga:pageviews',
                                                'max-results': 5
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--topContent',
                                                type: 'TABLE'
                                            }
                                        },
                                        {
                                            query: {
                                                dimensions: 'ga:keyword',
                                                metrics: 'ga:sessions',
                                                sort: '-ga:sessions',
                                                'max-results': 5
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--topKeywords',
                                                type: 'TABLE'
                                            }
                                        },
                                        {
                                            query: {
                                                dimensions: 'ga:channelGrouping',
                                                metrics: 'ga:sessions',
                                                sort: '-ga:sessions'
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--topChannels',
                                                type: 'PIE'
                                            }
                                        },
                                        {
                                            query: {
                                                dimensions: 'ga:dayOfWeekName',
                                                metrics: 'ga:sessions',
                                                filters: 'ga:hasSocialSourceReferral==Yes'
                                            },
                                            chart: {
                                                container: 'ss-ga-report--chart--visitsViaSocial',
                                                type: 'LINE'
                                            }
                                        }
                                    ],
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
                                    timeoutLimit = 750,
                                    saved = [];

                                if(externalAnalytics.ga.accountId) {
                                    statOptions.query.ids = chartOptions.query.ids = ['ga:' + externalAnalytics.ga.accountId];
                                }

                                for(var stats_i=0;stats_i<statistics.length;stats_i++) {
                                    var containers = [],
                                        stats_fn = function(report) {
                                            setTimeout(function() {
                                                report.execute();
                                                timeout++;
                                            }, timeout * timeoutLimit);
                                        },
                                        report = new gapi.analytics.report.Data($.extend(true, {}, statOptions, {
                                            query: {
                                                metrics: $.map(statistics[stats_i], function(value, key) {
                                                    return key;
                                                }).join(',')
                                            }
                                        }));

                                    (function(stats) {
                                        report.on('success', function(response) {
                                            if(response && response.hasOwnProperty('totalsForAllResults')) {
                                                for(var metric in response.totalsForAllResults) {
                                                    if(response.totalsForAllResults.hasOwnProperty(metric) && stats.hasOwnProperty(metric)) {
                                                        if(stats[metric].hasOwnProperty('type')) {
                                                            if(stats[metric].type == 'percentage') {
                                                                response.totalsForAllResults[metric] = parseFloat(response.totalsForAllResults[metric]).toFixed(2);
                                                                response.totalsForAllResults[metric] += '%';
                                                            }
                                                            else if(stats[metric].type == 'money') {
                                                                response.totalsForAllResults[metric] = parseFloat(response.totalsForAllResults[metric]).toFixed(2);
                                                                response.totalsForAllResults[metric] = '$' + response.totalsForAllResults[metric];
                                                            }
                                                            else if(stats[metric].type == 'time') {
                                                                response.totalsForAllResults[metric] = Math.round(parseFloat(response.totalsForAllResults[metric]));
                                                                response.totalsForAllResults[metric] = response.totalsForAllResults[metric] + ' seconds';
                                                            }
                                                            else if(stats[metric].type == 'int') {
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

                                    (function(stats_fn, report) {
                                        report.on('error', function(response) {
                                            if(response && response.hasOwnProperty('error') && response.error.hasOwnProperty('code') && response.error.code == 403) {
                                                timeout = 1;
                                                stats_fn(report);
                                            }
                                        });
                                    })(stats_fn, report);

                                    saved.push({
                                        containers: containers.join(','),
                                        item: report
                                    });

                                    if(externalAnalytics.ga.accountId)
                                        stats_fn(report);
                                }

                                for(var charts_i=0;charts_i<charts.length;charts_i++) {
                                    var chart = new gapi.analytics.googleCharts.DataChart($.extend(true, {}, chartOptions, charts[charts_i])),
                                        charts_fn = function(chart) {
                                            setTimeout(function() {
                                                chart.execute();
                                                $('#' + chart.qa.chart.container).parent().removeClass('processing');
                                                timeout++;
                                            }, timeout * timeoutLimit);
                                        };

                                    (function(charts_fn, chart) {
                                        chart.on('error', function(response) {
                                            if(response && response.hasOwnProperty('error') && response.error.hasOwnProperty('code') && response.error.code == 403) {
                                                timeout = 1;
                                                charts_fn(chart);
                                            }
                                        });
                                    })(charts_fn, chart);

                                    saved.push({
                                        containers: '#' + chart.qa.chart.container,
                                        item: chart
                                    });

                                    if(externalAnalytics.ga.accountId)
                                        charts_fn(chart);
                                }

                                if(!externalAnalytics.ga.accountId) {
                                    var selector = new gapi.analytics.ViewSelector({
                                        container: 'ss-ga-report--view-selector'
                                    });

                                    selector.on('change', function(ids) {
                                        timeout = 0;

                                        for(var saved_i=0;saved_i<saved.length;saved_i++) {
                                            (function(saved_i) {
                                                setTimeout(function() {
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
                                clientid: externalAnalytics.ga.clientId
                            };

                        if(externalAnalytics.ga.accessToken) {
                            authorize.serverAuth = {
                                access_token: externalAnalytics.ga.accessToken
                            };
                        }

                        gapi.analytics.auth.authorize(authorize);

                        if(gapi.analytics.auth.isAuthorized())
                            fn();

                        gapi.analytics.auth.on('error', function(error) {

                        });

                        gapi.analytics.auth.on('success', function(response) {
                            if(response && response.access_token) {
                                $.post(externalAnalytics.ga.accessTokenUrl, {
                                    access_token: response.access_token
                                });
                            }

                            fn();
                        });
                    });
            }
        });
    });
})(jQuery);