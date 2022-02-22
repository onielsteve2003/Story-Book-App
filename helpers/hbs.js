const moment = require('moment')

module.exports = {
    formatDate: (date, format) => {
        return moment(date).format(format)
    },
    // This it to help reduce the amount of text or sentences seen once unless u click the read more link which is in the index.hns
    truncate: (str, len) => {
        if(str.length > len && str.length > 0) {
            let new_str = str + ' '
            new_str = str.substr(0, len)
            new_str = str.substr(0, new_str.lastIndexOf(' '))
            new_str = new_str.length > 0 ? new_str : str.substr(0, len)
            return new_str + '...'
        }
        return str
    }, 
    // this it to stop the html tage from showing on the page in the public stories meaning whereever u see those tage, replace them with nothing, thats d meaning of the striptags code
    stripTags: function (input) {
         return input.replace(/(<([^>]+)>)/gi, " ")
    },
    // This is for the edit button
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if(storyUser._id.toString() == loggedUser._id.toString()){
            if(floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating" halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit></i></a>"`
            }
        } else {
            return ''
        }
    },
    // This helper is for the select in the edit.hbs in the sense that if it is public, we want it to show on the edit page
    select: function (selected, options) {
        return options
        .fn(this)
        .replace(
            new RegExp(' value="' + selected + '"'),
            '$& selected="selected"'
        )
        .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'
        )
    },
}