import Booster from '@flowbase-co/booster'

enum SocialShareAttrNames {
  Root = 'fb-social',
  Type = 'fb-social-type',
}

enum SocialShareType {
  Facebook = 'facebook',
  Linkedin = 'linkedin',
  Pinterest = 'pinterest',
  Telegram = 'telegram',
  Twitter = 'twitter',
  Whatsapp = 'whatsapp',
}

type SocialShareAttributes = {
  [SocialShareAttrNames.Type]?: SocialShareType
}

const socialShareBooster = new Booster.Booster<SocialShareAttributes, Element>({
  name: SocialShareAttrNames.Root,
  attributes: {
    [SocialShareAttrNames.Type]: {
      defaultValue: undefined,
      validate: Object.values(SocialShareType),
    },
  },
  apply(element, data) {
    const elementTag = element.tagName.toLowerCase()

    if (elementTag !== 'a') {
      return this.log('Unsupported HTML tag detected. Use <a> tag instead')
    }

    const type = data.get(SocialShareAttrNames.Type)

    if (!type) return

    const pageTitle = encodeURIComponent(document.title)
    const pageURL = encodeURIComponent(window.location.href)

    let href = '#'

    switch (type) {
      case SocialShareType.Facebook:
        href = `https://www.facebook.com/sharer/sharer.php?u=${pageURL}`
        break
      case SocialShareType.Linkedin:
        href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageURL}`
        break
      case SocialShareType.Pinterest:
        href = `https://pinterest.com/pin/create/button/?url=${pageURL}&description=${pageTitle}`
        break
      case SocialShareType.Telegram:
        href = `https://t.me/share/url?url=${pageURL}&text=${pageTitle}`
        break
      case SocialShareType.Twitter:
        href = `https://twitter.com/intent/post/?url=${pageURL}&text=${pageTitle}`
        break
      case SocialShareType.Whatsapp:
        href = `https://api.whatsapp.com/send/?text=${pageTitle}%20${pageURL}`
        break
    }

    element.setAttribute('href', href)
    element.setAttribute('target', '_blank')
  },
  title: 'Social Share Booster',
  documentationLink: 'https://www.flowbase.co/booster/share-to-social-media',
})

export const SocialShareFlowbase = () => socialShareBooster.init()
