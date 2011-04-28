class ContentTypeMiddleware(object):

    def process_request(self, request):
        if request.META['CONTENT_TYPE'] == 'application/json; charset=UTF-8':
            request.META['CONTENT_TYPE'] = 'application/json'
        return None