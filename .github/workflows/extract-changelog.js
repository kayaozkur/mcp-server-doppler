const fs = require('fs');

function extractLatestChangelog() {
  const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');
  
  // Find the first version section
  const versionMatch = changelog.match(/## \[([\d.]+)\](.*?)(?=## \[|$)/s);
  
  if (!versionMatch) {
    console.log('No version found in changelog');
    return '';
  }
  
  const version = versionMatch[1];
  const content = versionMatch[0];
  
  // Clean up the content
  const cleanedContent = content
    .replace(/^## \[[\d.]+\].*$/m, '') // Remove version header
    .trim();
  
  // Write to file for GitHub Action to use
  fs.writeFileSync('./release-notes.md', cleanedContent);
  
  console.log(`Extracted changelog for version ${version}`);
  return cleanedContent;
}

extractLatestChangelog();