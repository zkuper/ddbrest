/*jshint -W030 */

var facetTestHelper = require('../utils/facetTestHelper'),
    query = 'Berlin';

describe('search method', function() {

    before(function() {
        should.exist(api.search);
    });

    describe('has a search interface that', function() {

        it('should provide certain methods to set facets', function() {
            var searchMethod = api.search('some search string');
            searchMethod.should.have.ownProperty('place');
            searchMethod.should.have.ownProperty('role');
            searchMethod.should.have.ownProperty('keywords');
            searchMethod.should.have.ownProperty('language');
            searchMethod.should.have.ownProperty('type');
            searchMethod.should.have.ownProperty('sector');
            searchMethod.should.have.ownProperty('provider');
        });

        it('makes it possible to search something', function() {
            return api.search(query).get().should.have.eventually.property('numberOfResults');
        });

        describe('should provide facets to define the search result', function() {

            /**
             * the following tests query all possible facets first to do
             * another request using a random facet
             */
            it('by using the place facet',        facetTestHelper(api.search(query), 'place', 'place_fct'));
            it('by using the keywords facet',     facetTestHelper(api.search(query), 'keywords', 'keywords_fct'));
            it('by using the type facet',         facetTestHelper(api.search(query), 'type', 'type_fct'));
            it('by using the provider facet',     facetTestHelper(api.search(query), 'provider', 'provider_fct'));
            it('by using the role facet',         facetTestHelper(api.search(query), 'role', 'affiliate_fct_role'));
            it('by using the language facet',     facetTestHelper(api.search(query), 'language', 'language_fct'));
            it('by using the sector facet',       facetTestHelper(api.search(query), 'sector', 'sector_fct'));
            it('by using the licenseGroup facet', facetTestHelper(api.search(query), 'licenseGroup', 'license_group'));
            it('by using the license facet',      facetTestHelper(api.search(query), 'license', 'license'));
            it('by using the time facet',         facetTestHelper(api.search(query), 'time', 'time_fct'));

        });

    });

    describe('has additional search options which', function() {

        it('are available when passing no arguments to the search method', function() {
            var searchMethod = api.search();
            searchMethod.should.have.ownProperty('facets');
            searchMethod.should.have.ownProperty('sortcriteria');
            searchMethod.should.have.ownProperty('suggest');
        });

        describe('are a facet method that', function() {

            it('should throw an error if a wrong parameter or facet type is given', function() {
                 api.search().facets.bind(null, 'wrongFacetType').should.throw();
                 api.search().facets.bind(null, {wrong: 'parametertype'}).should.throw();
                 api.search().facets.bind(null, 'extended').should.not.throw();
                 api.search().facets.bind(null, 'search').should.not.throw();
                 api.search().facets.bind(null, 'technical').should.not.throw();
            });

            it('should return all possible extended facets', function() {
                return expect(api.search().facets('extended')).to.have.eventually.length.above(0);
            });

            it('should return all possible search facets', function() {
                return expect(api.search().facets('search')).to.have.eventually.length.above(0);
            });

            it('should return all possible technical facets', function() {
                return expect(api.search().facets('technical')).to.have.eventually.length.above(0);
            });

        });

        describe('are a sortcriteria method that', function() {

            it('should throw an error if an argument was passed', function() {
                api.search().sortcriteria.bind(null, function(){}).should.throw();
            });

            it('should return sortcriterias', function() {
                return api.search().sortcriteria().should.eventually.contain({default: 'RELEVANCE'});
            });

        });

        describe('are a suggest method that', function() {

            it('should throw an error if the argument is null or not typeof string', function() {
                api.search().suggest.bind(null, function(){}).should.throw();
                api.search().suggest.bind(null, 999).should.throw();
                api.search().suggest.bind(null, true).should.throw();
                api.search().suggest.bind(null).should.throw();
            });

            it('should return suggestions', function() {
                return expect(api.search().suggest('Berlin')).to.have.eventually.length.above(0);
            });

        });

    });

});