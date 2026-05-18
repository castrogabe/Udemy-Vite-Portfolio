import mongoose from 'mongoose';

const designContentSchema = new mongoose.Schema({
  jumbotronImage: {
    url: { type: String, required: false },
    name: { type: String },
  },
  sections: [
    {
      title: { type: String, required: true },
      paragraphs: [{ type: String, required: true }],
      link: { type: String },
      linkText: { type: String },
      images: [
        {
          url: { type: String, required: true },
          name: { type: String },
        },
      ],
    },
  ],
});

const DesignContent = mongoose.model('DesignContent', designContentSchema);

export default DesignContent;

// If you want to review the commented teaching version of the designContentModel.js setup, check commit lesson-13.
