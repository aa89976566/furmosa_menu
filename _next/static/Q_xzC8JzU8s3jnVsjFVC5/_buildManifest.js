self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/haodada"
      },
      {
        "source": "/haodada/:path*"
      }
    ],
    "beforeFiles": [
      {
        "source": "/aa89976566/furmosa_menu/cursor/static-mobile-preview-0dea/_next/:path+",
        "destination": "/_next/:path+"
      },
      {
        "has": [
          {
            "type": "host",
            "value": "catnip-chick.furmosa.com"
          }
        ],
        "source": "/"
      },
      {
        "has": [
          {
            "type": "host",
            "value": "catnip-chick.furmosa.com"
          }
        ],
        "source": "/:path*"
      }
    ],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()