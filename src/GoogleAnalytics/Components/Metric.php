<?php namespace Milkyway\SS\ExternalAnalytics\Reports\GoogleAnalytics\Components;

/**
 * Milkyway Multimedia
 * Metric.php
 *
 * @package milkywaymultimedia.com.au
 * @author Mellisa Hankins <mell@milkywaymultimedia.com.au>
 */

use ViewableData;

class Metric extends ViewableData {
    protected $metric;

    protected $title;

    protected $options = [];

    protected $id;

    public function __construct($metric, $title = '', $options = [], $id = '') {
        $this->metric = $metric;

        if($id) {
            $this->id = $id;
        }
        else {
            $this->id = substr($metric, 0, 3) == 'ga:' ? substr($metric, 3) : $metric;
        }

        if($title) {
            $this->title = $title;
        }
        else {
            $this->title = \FormField::name_to_label($this->id);
        }

        $this->options = array_merge($this->options, [
            'container' => '#ss-ga-report--metric-value--' . $this->id,
        ], $options);
    }

    public function i18n_title() {
        return _t('ExternalAnalytics.Reports.Metric.' . $this->id, $this->title);
    }

    public function json() {
        return [
            $this->metric => $this->options,
        ];
    }

    public function forTemplate() {
        $vars = [
            'Title' => $this->i18n_title(),
            'ID' => $this->id,
        ];

        return str_replace(array_keys($vars), $vars,'
        <div class="ss-ga-report--metric processing">
            $Title <strong class="ss-ga-report--metric-value" id="ss-ga-report--metric-value--$ID"></strong>
        </div>');
    }
} 