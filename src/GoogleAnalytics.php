<?php
/**
 * Milkyway Multimedia
 * Config.php
 *
 * @package milkywaymultimedia.com.au
 * @author Mellisa Hankins <mell@milkywaymultimedia.com.au>
 */

use \Milkyway\SS\ExternalAnalytics\Config\Contract as Config;
use \Milkyway\SS\ExternalAnalytics\Utilities as Utilities;

class Milkyway_SS_ExternalAnalytics_Reports_GoogleAnalytics extends SS_Report {
    protected $title = 'Google Analytics';

    protected $config;

    public function __construct(Config $config = null) {
        $this->config = $config;
        parent::__construct();
    }

    public function includes() {
        if(!$this->canView()) return;

        if($clientId = Utilities::env_value('ApiClientId', $this, $this->config)) {
            Requirements::insertHeadTags('<script type="text/javascript">' . \ArrayData::create([
                        'ClientId' => $clientId,
                        'AccountId' => Utilities::env_value('ReportsAccountId', $this, $this->config),
                        'AccessToken' => singleton('Milkyway\SS\ExternalAnalytics\Reports\Controllers\SaveAccessToken')->token(),
                        'AccessTokenUrl' => singleton('Milkyway\SS\ExternalAnalytics\Reports\Controllers\SaveAccessToken')->Link(),
                    ]
            )->renderWith('IncludeJavascript_GoogleAnalytics_ForReports') . '</script>', __CLASS__ . '-script');
        }
    }

    public function getCMSFields() {
        \Requirements::css(SS_EXTERNAL_ANALYTICS_REPORTS_DIR . '/css/external-analytics-reports.css');

        Requirements::javascript(THIRDPARTY_DIR . '/jquery/jquery.js');
        Requirements::javascript(THIRDPARTY_DIR . '/jquery-entwine/dist/jquery.entwine-dist.js');
        \Requirements::javascript(SS_EXTERNAL_ANALYTICS_REPORTS_DIR . '/js/external-analytics-reports.googleanalytics.js');

        $this->afterExtending('updateCMSFields', function($fields) {
            $fields->removeByName('ReportTitle');
        });
        return parent::getCMSFields();
    }

    public function getReportField() {
        return \LiteralField::create('Report', $this->renderWith('ExternalAnalytics_Reports_GoogleAnalytics'));
    }

    public function parameterFields() {
        return null;
    }

    public function canView($member = null) {
        return Utilities::env_value('ApiClientId', $this, $this->config) !== null;
    }
} 