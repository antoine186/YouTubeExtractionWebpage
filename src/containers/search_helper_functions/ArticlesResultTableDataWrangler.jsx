import EmoEngagementStringFormatter from './EmoEngagementStringFormatter'

function ArticlesResultTableDataWrangler (data) {
  const averageEmoBreakdown = data.average_emo_breakdown
  const emoBreakdownResults = data.emo_breakdown_results
  const happiestArticle = data.happiest_article
  const mostAngryArticle = data.most_angry_article
  const mostDisgustedArticle = data.most_disgusted_article
  const mostFearfulArticle = data.most_fearful_article
  const mostNeutralArticle = data.most_neutral_article
  const mostSurprisedArticle = data.most_surprised_article
  const sadestArticle = data.sadest_article

  const happiestArticleData = {
    article_category: 'Happiest Article',
    title: happiestArticle.title,
    description: happiestArticle.description,
    publisher: happiestArticle.publisher,
    published_date: happiestArticle.published_date,
    emotional_engagement: EmoEngagementStringFormatter(happiestArticle.emo_breakdown),
    url: happiestArticle.url,
    thumbnail: happiestArticle.youtube_thumbnail
  }
  const mostAngryArticleData = {
    article_category: 'Angriest Article',
    title: mostAngryArticle.title,
    description: mostAngryArticle.description,
    publisher: mostAngryArticle.publisher,
    published_date: mostAngryArticle.published_date,
    emotional_engagement: EmoEngagementStringFormatter(mostAngryArticle.emo_breakdown),
    url: mostAngryArticle.url,
    thumbnail: mostAngryArticle.youtube_thumbnail
  }
  const mostDisgustedArticleData = {
    article_category: 'Most Disgusted Article',
    title: mostDisgustedArticle.title,
    description: mostDisgustedArticle.description,
    publisher: mostDisgustedArticle.publisher,
    published_date: mostDisgustedArticle.published_date,
    emotional_engagement: EmoEngagementStringFormatter(mostDisgustedArticle.emo_breakdown),
    url: mostDisgustedArticle.url,
    thumbnail: mostDisgustedArticle.youtube_thumbnail
  }
  const mostFearfulArticleData = {
    article_category: 'Most Fearful Article',
    title: mostFearfulArticle.title,
    description: mostFearfulArticle.description,
    publisher: mostFearfulArticle.publisher,
    published_date: mostFearfulArticle.published_date,
    emotional_engagement: EmoEngagementStringFormatter(mostFearfulArticle.emo_breakdown),
    url: mostFearfulArticle.url,
    thumbnail: mostFearfulArticle.youtube_thumbnail
  }
  const mostNeutralArticleData = {
    article_category: 'Most Neutral Article',
    title: mostNeutralArticle.title,
    description: mostNeutralArticle.description,
    publisher: mostNeutralArticle.publisher,
    published_date: mostNeutralArticle.published_date,
    emotional_engagement: EmoEngagementStringFormatter(mostNeutralArticle.emo_breakdown),
    url: mostNeutralArticle.url,
    thumbnail: mostNeutralArticle.youtube_thumbnail
  }
  const mostSurprisedArticleData = {
    article_category: 'Most Surprised Article',
    title: mostSurprisedArticle.title,
    description: mostSurprisedArticle.description,
    publisher: mostSurprisedArticle.publisher,
    published_date: mostSurprisedArticle.published_date,
    emotional_engagement: EmoEngagementStringFormatter(mostSurprisedArticle.emo_breakdown),
    url: mostSurprisedArticle.url,
    thumbnail: mostSurprisedArticle.youtube_thumbnail
  }
  const sadestArticleData = {
    article_category: 'Sadest Article',
    title: sadestArticle.title,
    description: sadestArticle.description,
    publisher: sadestArticle.publisher,
    published_date: sadestArticle.published_date,
    emotional_engagement: EmoEngagementStringFormatter(sadestArticle.emo_breakdown),
    url: sadestArticle.url,
    thumbnail: sadestArticle.youtube_thumbnail
  }

  return {
    Happiest: happiestArticleData,
    Angriest: mostAngryArticleData,
    Disgusted: mostDisgustedArticleData,
    Fearful: mostFearfulArticleData,
    Neutral: mostNeutralArticleData,
    Surprised: mostSurprisedArticleData,
    Sadest: sadestArticleData
  }
}

export default ArticlesResultTableDataWrangler
