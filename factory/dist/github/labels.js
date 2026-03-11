import { ghWrite } from './client.js';
export function addLabel(issueNumber, label, repo) {
    ghWrite(`issue edit ${issueNumber} --add-label "${label}"`, repo);
}
export function removeLabel(issueNumber, label, repo) {
    ghWrite(`issue edit ${issueNumber} --remove-label "${label}"`, repo);
}
/** Remove one label and add another atomically (single gh invocation) */
export function transitionLabel(issueNumber, fromLabel, toLabel, repo) {
    ghWrite(`issue edit ${issueNumber} --remove-label "${fromLabel}" --add-label "${toLabel}"`, repo);
}
//# sourceMappingURL=labels.js.map