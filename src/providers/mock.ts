import { AIProvider, GenerateParams } from "./types";

export class MockProvider implements AIProvider {
  async generate(params: GenerateParams): Promise<string> {
    const { position, company, tone, jobDescription, resumeText } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let greeting = `Dear Hiring Team at ${company},`;
    let intro = "";
    let body1 = "";
    let body2 = "";
    let conclusion = "";

    switch (tone) {
      case "Enthusiastic":
        intro = `I am absolutely thrilled to submit my application for the ${position} position at ${company}. As a dedicated professional who has long admired ${company}’s culture and industry-defining impact, the opportunity to contribute to your team is incredibly exciting to me.`;
        body1 = `My background matches the dynamic requirements of the ${position} role. In my previous experiences, I have focused on solving complex challenges, collaborating across cross-functional teams, and pushing for innovative solutions. I thrive in fast-paced environments where continuous learning and proactive communication are key to delivering exceptional results.`;
        body2 = `Looking at your team’s recent milestones, I am eager to apply my experience in optimizing operational workflows and building solid, scalable systems. I believe that my active problem-solving mindset and positive energy will align perfectly with ${company}'s ambitious goals.`;
        conclusion = `I would love the opportunity to discuss how my enthusiasm and technical skills can add immediate value to your department. Thank you for your time and consideration!`;
        break;
      case "Concise":
        greeting = `Dear Hiring Manager,`;
        intro = `Please accept my application for the open ${position} role at ${company}. With my background in this field, I am confident I can make an immediate contribution.`;
        body1 = `Throughout my career, I have developed strong competencies matching your requirements. I focus on building efficient systems, resolving technical bottlenecks, and cooperating with stakeholders to drive business outcomes.`;
        body2 = `I am skilled at adapting quickly to new technologies and working in structured development pipelines. I look forward to bringing this experience to the team at ${company}.`;
        conclusion = `Thank you for reviewing my credentials. I hope to speak with you soon in an interview.`;
        break;
      case "Confident":
        intro = `I am writing to express my strong interest in the ${position} role at ${company}. With a track record of executing key projects and driving team efficiency, I am prepared to step in and immediately elevate your department's outputs.`;
        body1 = `I specialize in engineering high-impact solutions, improving operations, and translating business goals into scalable systems. My experience has equipped me to handle the technical complexities and cross-functional leadership required for this role.`;
        body2 = `I don't just complete projects; I focus on optimization and long-term stability. I am confident that my analytical capabilities and strategic approach will help ${company} achieve its next level of growth.`;
        conclusion = `I look forward to discussing how my experience can support your team's objectives in an interview. Thank you for your consideration.`;
        break;
      default: // Professional
        intro = `I am writing to express my interest in the ${position} position at ${company}. With my professional background and dedication to delivering clean, effective solutions, I am confident in my capability to make a meaningful contribution to your team.`;
        body1 = `In my previous work, I have focused on designing stable workflows, collaborating closely with developers and designers, and solving complex technical challenges. I pride myself on writing readable code and establishing architectures that scale.`;
        body2 = `The responsibilities of the ${position} position align closely with my skills. I am eager to bring my detail-oriented approach to ${company} and help the team build robust platforms that serve your growing client base.`;
        conclusion = `Thank you for your time and consideration. I look forward to the possibility of discussing how my qualifications align with the needs of ${company}.`;
    }

    // Add elements of resume or job desc if provided
    if (jobDescription && jobDescription.trim().length > 10) {
      body2 += ` Additionally, my experience matches the key requirements outlined in the job description, especially surrounding core deliverables.`;
    }
    if (resumeText && resumeText.trim().length > 10) {
      body1 += ` As outlined in my resume, I have a history of implementing successful solutions, which I plan to replicate for your team.`;
    }

    return `Candidate Name\nCandidate Profile\n\n${date}\n\n${greeting}\n\n${intro}\n\n${body1}\n\n${body2}\n\n${conclusion}\n\nSincerely,\nCandidate Name`;
  }
}
