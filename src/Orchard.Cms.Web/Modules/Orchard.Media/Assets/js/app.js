﻿var navigationApp = new Vue({
    el: '#navigationApp',
    data: {
        folders: [],
        selectedFolder: null
    },
    computed: {
        uploadUrl: function() {
            return this.selectedFolder ? $('#uploadFiles').val() + "?folderPath=" + encodeURIComponent(this.selectedFolder.path) : null;
        }
    },
    mounted : function () {
        var self = this;
        $.ajax({
            url: $('#getFoldersUrl').val(),
            method: 'GET',
            success: function (data) {
                self.folders = data;
            },
            error: function (error) {
                alert(JSON.stringify(error));
            }
        });
    },
    methods: {
        selectFolder : function (folder) {
            this.selectedFolder = folder;
            filesApp.loadFolder(folder);
        },
        uploadUrl: function() {
            return this.selectedFolder ? $('#uploadFiles').val() + "?folderPath=" + encodeURIComponent(this.selectedFolder.path) : null;
        }
    }
});

// define the folder component
Vue.component('folder', {
  template: '#folder-template',
  props: {
    model: Object
  },
  data: function () {
    return {
        open: false,
        empty: false,
        children: null
    }
  },
  methods: {
    toggle: function () {
        this.open = !this.open
        var self = this;
        if (this.open && !this.children) {
            $.ajax({
                url: $('#getFoldersUrl').val() + "?path=" + encodeURIComponent(self.model.path),
                method: 'GET',
                success: function (data) {
                    self.children = data;
                    self.empty = data.length == 0;
                },
                error: function (error) {
                    emtpy = false;
                    alert(JSON.stringify(error));
                }
            });
        }
    },
    select: function () {
        navigationApp.selectFolder(this.model);
    }
  }
})

var filesApp = new Vue({
    el: '#filesApp',
    data: {
        mediaItems: [],
        selectedMedia: null,
    },
    mounted : function () {
    },
    methods: {

        loadFolder: function(folder) {
            this.selectedMedia = null;
            var self = this;
            $.ajax({
                url: $('#getMediaItemsUrl').val() + "?path=" + encodeURIComponent(folder.path),
                method: 'GET',
                success: function (data) {
                    data.forEach(function(item) {
                        item.open = false;
                    });
                    self.mediaItems = data;
                },
                error: function (error) {
                    alert(JSON.stringify(error));
                }
            });
        },

        selectMedia : function (media) {
            this.selectedMedia = media;
        }
    }
});

