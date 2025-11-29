from rest_framework.throttling import SimpleRateThrottle
from rest_framework.throttling import SimpleRateThrottle, UserRateThrottle

class IPThrottle(SimpleRateThrottle):
    scope = 'ip'
    
    def get_cache_key(self, request, view):
        return self.get_ident(request)
    

class ChangePasswordThrottle(UserRateThrottle):
    rate = '5/hour'