// Sanity Schema Definition for WOK360 Media Content
// This schema should be deployed to your Sanity project

export const mediaContentSchema = {
  name: 'mediaContent',
  title: 'Media Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'zone',
      title: 'Zone',
      type: 'string',
      options: {
        list: [
          { title: 'Kazmo Mansion', value: 'kazmo' },
          { title: 'Club Hollywood', value: 'clubHollywood' },
          { title: 'Shadow Market', value: 'shadowMarket' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'wing',
      title: 'Wing/Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Light Wing', value: 'light' },
          { title: 'Dark Wing', value: 'dark' },
          { title: 'Both', value: 'both' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Audio Mix', value: 'audio' },
          { title: 'Live Session', value: 'live' },
          { title: 'Story Panel', value: 'story' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mediaFile',
      title: 'Media File',
      type: 'file',
      options: {
        accept: 'video/*,audio/*',
      },
      description: 'Upload video or audio file',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true, // Enables focal point selection
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      placeholder: 'e.g., 42:18',
      description: 'Format: MM:SS or HH:MM:SS',
    },
    {
      name: 'isLive',
      title: 'Is Live Stream',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'liveStreamUrl',
      title: 'Live Stream URL',
      type: 'url',
      description: 'External live stream URL (if applicable)',
      hidden: ({ parent }) => !parent?.isLive,
    },
    {
      name: 'accessLevel',
      title: 'Access Level',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Premium Only', value: 'premium' },
          { title: 'Admin Only', value: 'admin' },
        ],
      },
      initialValue: 'public',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'featured',
      title: 'Featured Content',
      type: 'boolean',
      initialValue: false,
      description: 'Show in featured/hero sections',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'zone',
      media: 'thumbnail',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection;
      return {
        title,
        subtitle: `Zone: ${subtitle}`,
        media,
      };
    },
  },
};

// To deploy this schema to Sanity:
// 1. Install Sanity CLI: npm install -g @sanity/cli
// 2. Login: sanity login
// 3. Deploy: sanity schema deploy
