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

    public $batch = null;

    public function __construct($metric, $title = '', $options = [], $id = '', $batch = null) {
        $this->metric = $metric;
        $this->batch = $batch;

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

    public function getTitle() {
        return _t('ExternalAnalytics.Reports.Metric.' . $this->id, ucfirst($this->title));
    }

    public function getID() {
        return $this->id;
    }

    public function json() {
        return [
            $this->metric => $this->options,
        ];
    }
} 