import * as tslib_1 from "tslib";
import { catchError, distinctUntilKeyChanged, filter, first, map, take } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../shared/item.model';
import { GLOBAL_CONFIG } from '../../../config';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
var MetadataService = /** @class */ (function () {
    function MetadataService(router, translate, meta, title, envConfig) {
        this.router = router;
        this.translate = translate;
        this.meta = meta;
        this.title = title;
        this.envConfig = envConfig;
        // TODO: determine what open graph meta tags are needed and whether
        // the differ per route. potentially add image based on DSpaceObject
        this.meta.addTags([
            { property: 'og:title', content: 'DSpace Angular Universal' },
            { property: 'og:description', content: 'The modern front-end for DSpace 7.' }
        ]);
        this.initialized = false;
        this.tagStore = new Map();
    }
    MetadataService.prototype.listenForRouteChange = function () {
        var _this = this;
        this.router.events.pipe(filter(function (event) { return event instanceof NavigationEnd; }), map(function () { return _this.router.routerState.root; }), map(function (route) {
            route = _this.getCurrentRoute(route);
            return { params: route.params, data: route.data };
        })).subscribe(function (routeInfo) {
            _this.processRouteChange(routeInfo);
        });
    };
    MetadataService.prototype.processRemoteData = function (remoteData) {
        var _this = this;
        remoteData.pipe(map(function (rd) { return rd.payload; }), filter(function (co) { return hasValue(co); }), take(1))
            .subscribe(function (dspaceObject) {
            if (!_this.initialized) {
                _this.initialize(dspaceObject);
            }
            _this.currentObject.next(dspaceObject);
        });
    };
    MetadataService.prototype.processRouteChange = function (routeInfo) {
        var _this = this;
        if (routeInfo.params.value.id === undefined) {
            this.clearMetaTags();
        }
        if (routeInfo.data.value.title) {
            this.translate.get(routeInfo.data.value.title, routeInfo.data.value).pipe(take(1)).subscribe(function (translatedTitle) {
                _this.addMetaTag('title', translatedTitle);
                _this.title.setTitle(translatedTitle);
            });
        }
        if (routeInfo.data.value.description) {
            this.translate.get(routeInfo.data.value.description).pipe(take(1)).subscribe(function (translatedDescription) {
                _this.addMetaTag('description', translatedDescription);
            });
        }
    };
    MetadataService.prototype.initialize = function (dspaceObject) {
        var _this = this;
        this.currentObject = new BehaviorSubject(dspaceObject);
        this.currentObject.asObservable().pipe(distinctUntilKeyChanged('uuid')).subscribe(function () {
            _this.setMetaTags();
        });
        this.initialized = true;
    };
    MetadataService.prototype.getCurrentRoute = function (route) {
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    };
    MetadataService.prototype.setMetaTags = function () {
        this.clearMetaTags();
        this.setTitleTag();
        this.setDescriptionTag();
        this.setCitationTitleTag();
        this.setCitationAuthorTags();
        this.setCitationDateTag();
        this.setCitationISSNTag();
        this.setCitationISBNTag();
        this.setCitationLanguageTag();
        this.setCitationKeywordsTag();
        this.setCitationAbstractUrlTag();
        this.setCitationPdfUrlTag();
        if (this.isDissertation()) {
            this.setCitationDissertationNameTag();
            this.setCitationDissertationInstitutionTag();
        }
        if (this.isTechReport()) {
            this.setCitationTechReportInstitutionTag();
        }
        // this.setCitationJournalTitleTag();
        // this.setCitationVolumeTag();
        // this.setCitationIssueTag();
        // this.setCitationFirstPageTag();
        // this.setCitationLastPageTag();
        // this.setCitationDOITag();
        // this.setCitationPMIDTag();
        // this.setCitationFullTextTag();
        // this.setCitationConferenceTag();
        // this.setCitationPatentCountryTag();
        // this.setCitationPatentNumberTag();
    };
    /**
     * Add <meta name="title" ... >  to the <head>
     */
    MetadataService.prototype.setTitleTag = function () {
        var value = this.getMetaTagValue('dc.title');
        this.addMetaTag('title', value);
        this.title.setTitle(value);
    };
    /**
     * Add <meta name="description" ... >  to the <head>
     */
    MetadataService.prototype.setDescriptionTag = function () {
        // TODO: truncate abstract
        var value = this.getMetaTagValue('dc.description.abstract');
        this.addMetaTag('desciption', value);
    };
    /**
     * Add <meta name="citation_title" ... >  to the <head>
     */
    MetadataService.prototype.setCitationTitleTag = function () {
        var value = this.getMetaTagValue('dc.title');
        this.addMetaTag('citation_title', value);
    };
    /**
     * Add <meta name="citation_author" ... >  to the <head>
     */
    MetadataService.prototype.setCitationAuthorTags = function () {
        var values = this.getMetaTagValues(['dc.author', 'dc.contributor.author', 'dc.creator']);
        this.addMetaTags('citation_author', values);
    };
    /**
     * Add <meta name="citation_date" ... >  to the <head>
     */
    MetadataService.prototype.setCitationDateTag = function () {
        var value = this.getFirstMetaTagValue(['dc.date.copyright', 'dc.date.issued', 'dc.date.available', 'dc.date.accessioned']);
        this.addMetaTag('citation_date', value);
    };
    /**
     * Add <meta name="citation_issn" ... >  to the <head>
     */
    MetadataService.prototype.setCitationISSNTag = function () {
        var value = this.getMetaTagValue('dc.identifier.issn');
        this.addMetaTag('citation_issn', value);
    };
    /**
     * Add <meta name="citation_isbn" ... >  to the <head>
     */
    MetadataService.prototype.setCitationISBNTag = function () {
        var value = this.getMetaTagValue('dc.identifier.isbn');
        this.addMetaTag('citation_isbn', value);
    };
    /**
     * Add <meta name="citation_language" ... >  to the <head>
     */
    MetadataService.prototype.setCitationLanguageTag = function () {
        var value = this.getFirstMetaTagValue(['dc.language', 'dc.language.iso']);
        this.addMetaTag('citation_language', value);
    };
    /**
     * Add <meta name="citation_dissertation_name" ... >  to the <head>
     */
    MetadataService.prototype.setCitationDissertationNameTag = function () {
        var value = this.getMetaTagValue('dc.title');
        this.addMetaTag('citation_dissertation_name', value);
    };
    /**
     * Add <meta name="citation_dissertation_institution" ... >  to the <head>
     */
    MetadataService.prototype.setCitationDissertationInstitutionTag = function () {
        var value = this.getMetaTagValue('dc.publisher');
        this.addMetaTag('citation_dissertation_institution', value);
    };
    /**
     * Add <meta name="citation_technical_report_institution" ... >  to the <head>
     */
    MetadataService.prototype.setCitationTechReportInstitutionTag = function () {
        var value = this.getMetaTagValue('dc.publisher');
        this.addMetaTag('citation_technical_report_institution', value);
    };
    /**
     * Add <meta name="citation_keywords" ... >  to the <head>
     */
    MetadataService.prototype.setCitationKeywordsTag = function () {
        var value = this.getMetaTagValuesAndCombine('dc.subject');
        this.addMetaTag('citation_keywords', value);
    };
    /**
     * Add <meta name="citation_abstract_html_url" ... >  to the <head>
     */
    MetadataService.prototype.setCitationAbstractUrlTag = function () {
        if (this.currentObject.value instanceof Item) {
            var value = [this.envConfig.ui.baseUrl, this.router.url].join('');
            this.addMetaTag('citation_abstract_html_url', value);
        }
    };
    /**
     * Add <meta name="citation_pdf_url" ... >  to the <head>
     */
    MetadataService.prototype.setCitationPdfUrlTag = function () {
        var _this = this;
        if (this.currentObject.value instanceof Item) {
            var item = this.currentObject.value;
            item.getFiles()
                .pipe(first(function (files) { return isNotEmpty(files); }), catchError(function (error) {
                console.debug(error.message);
                return [];
            }))
                .subscribe(function (bitstreams) {
                var _loop_1 = function (bitstream) {
                    bitstream.format.pipe(first(), catchError(function (error) {
                        console.debug(error.message);
                        return [];
                    }), map(function (rd) { return rd.payload; }), filter(function (format) { return hasValue(format); }))
                        .subscribe(function (format) {
                        if (format.mimetype === 'application/pdf') {
                            _this.addMetaTag('citation_pdf_url', bitstream.content);
                        }
                    });
                };
                for (var _i = 0, bitstreams_1 = bitstreams; _i < bitstreams_1.length; _i++) {
                    var bitstream = bitstreams_1[_i];
                    _loop_1(bitstream);
                }
            });
        }
    };
    MetadataService.prototype.hasType = function (value) {
        return this.currentObject.value.hasMetadata('dc.type', { value: value, ignoreCase: true });
    };
    /**
     * Returns true if this._item is a dissertation
     *
     * @returns {boolean}
     *      true if this._item has a dc.type equal to 'Thesis'
     */
    MetadataService.prototype.isDissertation = function () {
        return this.hasType('thesis');
    };
    /**
     * Returns true if this._item is a technical report
     *
     * @returns {boolean}
     *      true if this._item has a dc.type equal to 'Technical Report'
     */
    MetadataService.prototype.isTechReport = function () {
        return this.hasType('technical report');
    };
    MetadataService.prototype.getMetaTagValue = function (key) {
        return this.currentObject.value.firstMetadataValue(key);
    };
    MetadataService.prototype.getFirstMetaTagValue = function (keys) {
        return this.currentObject.value.firstMetadataValue(keys);
    };
    MetadataService.prototype.getMetaTagValuesAndCombine = function (key) {
        return this.getMetaTagValues([key]).join('; ');
    };
    MetadataService.prototype.getMetaTagValues = function (keys) {
        return this.currentObject.value.allMetadataValues(keys);
    };
    MetadataService.prototype.addMetaTag = function (property, content) {
        if (content) {
            var tag = { property: property, content: content };
            this.meta.addTag(tag);
            this.storeTag(property, tag);
        }
    };
    MetadataService.prototype.addMetaTags = function (property, content) {
        for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
            var value = content_1[_i];
            this.addMetaTag(property, value);
        }
    };
    MetadataService.prototype.storeTag = function (key, tag) {
        var tags = this.getTags(key);
        tags.push(tag);
        this.setTags(key, tags);
    };
    MetadataService.prototype.getTags = function (key) {
        var tags = this.tagStore.get(key);
        if (tags === undefined) {
            tags = [];
        }
        return tags;
    };
    MetadataService.prototype.setTags = function (key, tags) {
        this.tagStore.set(key, tags);
    };
    MetadataService.prototype.clearMetaTags = function () {
        var _this = this;
        this.tagStore.forEach(function (tags, property) {
            _this.meta.removeTag("property='" + property + "'");
        });
        this.tagStore.clear();
    };
    MetadataService.prototype.getTagStore = function () {
        return this.tagStore;
    };
    MetadataService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(4, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Router,
            TranslateService,
            Meta,
            Title, Object])
    ], MetadataService);
    return MetadataService;
}());
export { MetadataService };
//# sourceMappingURL=metadata.service.js.map