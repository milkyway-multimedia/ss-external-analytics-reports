<?php
/**
 * Milkyway Multimedia
 * Config.php
 *
 * @package milkywaymultimedia.com.au
 * @author Mellisa Hankins <mell@milkywaymultimedia.com.au>
 */

use Milkyway\SS\ExternalAnalytics\Drivers\GoogleAnalytics\Driver;
use \Milkyway\SS\ExternalAnalytics\Reports\GoogleAnalytics\Components\Chart as Chart;
use \Milkyway\SS\ExternalAnalytics\Reports\GoogleAnalytics\Components\Metric as Metric;

class Milkyway_SS_ExternalAnalytics_Reports_GoogleAnalytics_Report extends SS_Report {
    protected $title = 'Google Analytics';

    protected $driver;

    public function getCMSFields() {
        $this->afterExtending('updateCMSFields', function($fields) {
            $fields->removeByName('ReportTitle');
        });

        return parent::getCMSFields();
    }

    public function getReportField() {
        \Requirements::css(SS_EXTERNAL_ANALYTICS_REPORTS_DIR . '/css/external-analytics-reports.css');

        Requirements::javascript(THIRDPARTY_DIR . '/jquery/jquery.js');
        Requirements::javascript(THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js');
        \Requirements::javascript(SS_EXTERNAL_ANALYTICS_REPORTS_DIR . '/js/external-analytics-reports.googleanalytics.js');

        return \LiteralField::create('Report', $this->renderWith('ExternalAnalytics_Reports_GoogleAnalytics'));
    }

    public function parameterFields() {
        return null;
    }

    public function canView($member = null) {
        return $this->apiClientId() !== null;
    }

    public function getAttributesHTML() {
        $attributes = [
            'data-access-token' => json_encode(singleton('Milkyway\SS\ExternalAnalytics\Reports\GoogleAnalytics\Controllers\SaveAccessToken')->token()),
            'data-access-token-url' => singleton('Milkyway\SS\ExternalAnalytics\Reports\GoogleAnalytics\Controllers\SaveAccessToken')->Link(),
        ];

        if($clientId = $this->apiClientId())
            $attributes['data-client-id'] = $clientId;

        if($accountId = $this->accountId())
            $attributes['data-account-id'] = $accountId;

        if(($list = $this->Metrics()) && $list->exists()) {
            $list = $list->toArray();
            $attributes['data-metrics'] = [];

            array_walk($list, function($metricGroup) use(&$attributes) {
                if($metricGroup->Values) {
                    $metrics = $metricGroup->Values->toArray();
                    array_walk($metrics, function($metric) use(&$attributes) {
                        if($metric->batch !== null) {
                            if(!isset($attributes['data-metrics'][$metric->batch]))
                                $attributes['data-metrics'][$metric->batch] = [];

                            $attributes['data-metrics'][$metric->batch] = array_merge($attributes['data-metrics'][$metric->batch], $metric->json());
                        }
                        else
                            $attributes['data-metrics'][] = [$metric->json()];
                    });
                }
            });

            $attributes['data-metrics'] = array_values($attributes['data-metrics']);
        }

        if(($list = $this->Charts()) && $list->exists()) {
            $attributes['data-charts'] = array_map(function($chart) {
                return $chart->json();
            }, $list->toArray());
        }

        return count($attributes) ? implode(' ', array_map(function($attribute, $data) {
            return $attribute . '=\'' . (is_array($data) ? json_encode($data) : $data) . '\'';
        }, array_keys($attributes), $attributes)) : '';
    }

    public function Charts() {
        $list = [];
        foreach((array)$this->config()->charts as $id => $chart) {
            $list[] = Chart::create(
                $id,
                isset($chart['query']) ? (array)$chart['query'] : [],
                isset($chart['chart']) ? $chart['chart'] : [],
                isset($chart['title']) ? $chart['title'] : ''
            );
        }

        return \ArrayList::create($list);
    }

    public function Metrics() {
        $list = [];

        foreach((array)$this->config()->metrics as $title => $metrics) {
            $list[] = ArrayData::create([
                'Title' => $title,
                'Values' => \ArrayList::create(array_map(function($metric) {
                    return $this->makeMetric($metric);
                }, $metrics))
            ]);
        }

        return \ArrayList::create($list);
    }

    protected function makeMetric($metric) {
        return Metric::create(
            isset($metric['metric']) ? $metric['metric'] : '',
            isset($metric['title']) ? $metric['title'] : '',
            isset($metric['options']) ? (array)$metric['options'] : [],
            isset($metric['id']) ? $metric['id'] : '',
            isset($metric['batch']) ? $metric['batch'] : null
        );
    }

    protected function driver() {
        if($this->driver === null) {
            $idToUse = $this->defaultDriverId();
            $driverToUse = false;

            singleton('ea')->executeDrivers(function($driver, $id) use(&$driverToUse, $idToUse) {
                if($driverToUse !== false) return;

                if((!$idToUse && $driver instanceof Driver) || ($idToUse && $id == $idToUse))
                    $driverToUse = $driver;
            });

            $this->driver = $driverToUse;
        }

        return $this->driver;
    }

    protected function defaultDriverId() {
        return singleton('env')->get('GoogleAnalytics|Google|SiteConfig.ga_default_driver', null, [
            'objects' => [$this]
        ]);
    }

    protected function apiClientId() {
        return singleton('env')->get('GoogleAnalytics|Google|SiteConfig.ga_api_client_id', null, [
            'objects' => [$this]
        ]);
    }

    protected function accountId() {
        return singleton('env')->get('GoogleAnalytics|Google|SiteConfig.ga_reports_account_id', null, [
            'objects' => [$this]
        ]);
    }
}