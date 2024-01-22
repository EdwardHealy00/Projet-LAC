import { NavigateFunction } from "react-router-dom";
import { Case } from "../model/CaseStudy";

export function navToCorrectTab(routeParent: string, navigate: NavigateFunction, caseStudy: Case | undefined) {
    if(!caseStudy || caseStudy.isPaidCase) {
        navigate(routeParent + "/paid");
      }
      else {
        navigate(routeParent + "/free");
      }
}