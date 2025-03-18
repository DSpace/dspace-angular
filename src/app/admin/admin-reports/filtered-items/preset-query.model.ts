import { QueryPredicate } from './query-predicate.model';

export class PresetQuery {

  id: string;
  label: string;
  predicates: QueryPredicate[];

  static of(id: string, label: string, predicates: QueryPredicate[]) {
    const query = new PresetQuery();
    query.id = id;
    query.label = label;
    query.predicates = predicates;
    return query;
  }

}
