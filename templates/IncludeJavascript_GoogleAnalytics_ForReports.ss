var externalAnalytics = externalAnalytics || {};
externalAnalytics.ga = externalAnalytics.ga || {};

externalAnalytics.ga.clientId = '$ClientId';
externalAnalytics.ga.accessTokenUrl = '$AccessTokenUrl';

<% if $AccountId %>
    externalAnalytics.ga.accountId = '$AccountId';
<% end_if %>

<% if $AccessToken %>
    externalAnalytics.ga.accessToken = '$AccessToken';
<% end_if %>