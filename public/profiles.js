window.PROFILE_DATA = {
  defaultProfile: "danny",

  profiles: {
    danny: {
      slug: "danny",
      display: {
        name: "Danny Ward",
        subtitle: "Project Liaison",
        descriptor: "NYC Department of Homeless Services",
        bio: "Public-sector project liaison focused on operations, partnerships, and large-scale initiatives across New York City.",
        photo: "portrait.jpg",
        socialImage: "og-card.jpg",
        socialImageWidth: 1200,
        socialImageHeight: 628,
      },
      contact: {
        fullName: "Danny Ward",
        title: "Project Liaison",
        organization: "NYC Department of Homeless Services",
        phone: "+19143562495",
        email: "wardda@hra.nyc.gov",
        linkedin: "https://www.linkedin.com/in/daniel-ward-932a5b142/",
      },
      primaryAction: { type: "vcard", label: "Add to Contacts" },
      actions: [
        { type: "tel", label: "Call", icon: "call" },
        { type: "mailto", label: "Email", icon: "email" },
        {
          type: "url",
          label: "LinkedIn",
          icon: "linkedin",
          url: "https://www.linkedin.com/in/daniel-ward-932a5b142/",
          socialType: "linkedin",
        },
      ],
      sections: [],
      theme: "default",
    },

    darrin: {
      slug: "darrin",
      display: {
        name: "Hank & The Hustlers",
        subtitle: "Darrin Ward",
        descriptor: "Live Music / Rock & Roll",
        bio: "Live rock & roll, classic favorites, and good-time music throughout the New York area.",
        photo: "hank-and-the-hustlers.jpg",
        photoAlt: "Hank & The Hustlers logo",
        socialImage: "hank-and-the-hustlers.jpg",
        socialImageWidth: 640,
        socialImageHeight: 640,
      },
      contact: {
        fullName: "Darrin Ward",
        title: "Live Music / Rock & Roll",
        organization: "Hank & The Hustlers",
        phone: "+19143191820",
        email: "", // Add Darrin's email address here when available.
      },
      primaryAction: { type: "vcard", label: "Add to Contacts" },
      actions: [
        { type: "tel", label: "Call" },
        { type: "url", label: "Facebook", url: "https://www.facebook.com/TheHustlersNYC/", socialType: "facebook" },
        { type: "url", label: "Instagram", url: "https://www.instagram.com/hankandthehustlers/", socialType: "instagram" },
        { type: "mailto", label: "Email" },
      ],
      sections: [],
      theme: "default",
    },

    treasurer: {
      slug: "treasurer",
      display: {
        name: "Isaac",
        subtitle: "League Treasurer",
        descriptor: "Long Live Commish Chris Fantasy Football League",
        bio: "Responsible for safeguarding league assets, collecting dues, issuing payouts, and maintaining the financial integrity of the league.",
        photo: "isaac-headshot.png",
        photoAlt: "Isaac, League Treasurer",
      },
      contact: {
        fullName: "Isaac",
        title: "League Treasurer",
        organization: "Long Live Commish Chris Fantasy Football League",
        phone: "+19146061124",
      },
      primaryAction: {
        type: "url",
        label: "💰 Pay League Dues",
        url: "https://venmo.com/u/orkinporkin",
      },
      actions: [
        { type: "tel", label: "Call", icon: "call" },
        { type: "url", label: "Visit League", url: "https://sleeper.com/leagues/1387582361599758336/league" },
        { type: "url", label: "Report Fraud", url: "https://forms.fillout.com/t/kf7S67rnZ3us" },
      ],
      sections: [
        {
          id: "office-of-the-treasurer",
          type: "notice",
          title: "Office of the Treasurer",
          text: "Fiduciary oversight since 2026.",
        },
      ],
      theme: "treasury",
    },

    isaac: {
      slug: "isaac",
      display: {
        name: "Isaac Orkin",
        subtitle: "On-Site Project Manager",
        descriptor: "Douglas Elliman Property Management",
        bio: "Project manager with extensive experience managing the completion of high-end residential real estate projects in New York City. Fluent in Japanese.",
        photo: "isaac-headshot.png",
        photoAlt: "Isaac Orkin, On-Site Project Manager",
      },
      contact: {
        fullName: "Isaac Orkin",
        title: "On-Site Project Manager",
        organization: "Douglas Elliman Property Management",
        phone: "+19146061124",
        email: "Iorkin@me.com",
        linkedin: "https://www.linkedin.com/in/isaac-orkin-4bb415180/",
      },
      primaryAction: {
        type: "vcard",
        label: "Add to Contacts",
      },
      actions: [
        { type: "tel", label: "Call", icon: "call" },
        { type: "mailto", label: "Email", icon: "email" },
        {
          type: "url",
          label: "LinkedIn",
          icon: "linkedin",
          url: "https://www.linkedin.com/in/isaac-orkin-4bb415180/",
          socialType: "linkedin",
        },
      ],
      theme: "default",
    },
  },
};
