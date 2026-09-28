export interface MarketingExperiment {
  id?: string;
  user_id?: string;
  workspace_id?: string;
  objective: string;
  hypothesis: string;
  audience: string;
  strategy_used: string;
  variables?: string[];
  result_metrics: string;
  audience_reaction: string;
  outcome_status: 'SUCCESS' | 'FAILURE' | 'INCONCLUSIVE';
  interpretation: string;
  learning: string;
  strategic_rule?: string;
  lineage_experiment_ids?: string[];
  updated_at?: string;
  created_at?: string;
}

export interface EvaluationTiers {
  raw_experience: { experiment_ids: string[]; recorded_metrics: string[] };
  tactical_learning: string;
  strategic_rule: string;
}

export interface EvaluationResponse {
  verdict: 'CLEAR' | 'CAUTION' | 'HIGH RISK' | 'VALIDATED' | 'CHALLENGED' | 'UNTESTED_HYPOTHESIS';
  synthesis: string;
  recommended_action: string;
  supporting_experiments: MarketingExperiment[];
  tiers: EvaluationTiers;
  suggested_modifications: string[];
}
