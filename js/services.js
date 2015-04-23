angular.module('starter.services', [])

.factory('MyServices', function() {
    var contacts = [{
        id: 0,
        name: 'Chintan Shah',
        company: 'Wohlig Technology',
        area: 'Mumbai',
        image: 'http://i.imgur.com/1Ncgq84.jpg',
        number: '+919819222221',
        email: 'chintan@wohlig.com'
    }, {
        id: 1,
        name: 'Chirag Shah',
        company: 'Wohlig Technology',
        area: 'Mumbai',
        image: 'http://image.gala.de/v1/cms/AU/shahrukh-khan-ge_6276006-square-02_top_square.jpg?v=8176344',
        number: '+919820045678',
        email: 'chirag@wohlig.com'
    }, {
        id: 2,
        name: 'Tushar Sachde',
        company: 'Wohlig Technology',
        area: 'Mumbai',
        image: 'http://www.masala.com/sites/default/files/styles/4_columns_gutter_size_638px_wide_square/public/images/2014/10/26/DSC_0186.jpg?itok=B3gcHWe_',
        number: '+919029796018',
        email: 'tushar@wohlig.com'
    }, {
        id: 3,
        name: 'Nayan Bheda',
        company: 'Roots2Wings Ideas Pvt. Ltd',
        area: 'Mumbai',
        image: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg',
        number: '+919004121212',
        email: 'nayan@9004121212.com'
    }, {
        id: 4,
        name: 'Nilesh Halde',
        company: 'Roots2Wings Ideas Pvt. Ltd',
        area: 'Mumbai',
        image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg',
        number: '+919820752510',
        email: 'nileshhalde@gmail.com'
    }];

    return {
        all: function() {
            return contacts;
        },
    };
});