import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  currentStep,
  IngestionJob,
  isErrorJob,
  stageLabelKey,
  STAGES,
  StepState,
  stepState,
} from '../ingestion-stages';

/** Um passo já resolvido, para o template não chamar funções a cada render. */
interface Step {
  key: string;
  labelKey: string;
  state: StepState;
  index: number;
}

/**
 * Infográfico do estágio da ingestão de um job. Só de leitura: os passos são
 * calculados uma vez por mudança de job (`computed`), não a cada ciclo de
 * detecção de mudanças.
 */
@Component({
  selector: 'ds-ingestion-stepper',
  templateUrl: './ingestion-stepper.component.html',
  styleUrls: ['./ingestion-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslatePipe,
  ],
})
export class IngestionStepperComponent {

  readonly job = input.required<IngestionJob>();

  readonly hasError = computed(() => isErrorJob(this.job()));

  readonly steps = computed<Step[]>(() => {
    const job = this.job();
    return STAGES.map((stage: string, index: number) => ({
      key: stage,
      labelKey: stageLabelKey(stage),
      state: stepState(job, index),
      index,
    }));
  });

  /** Rótulo acessível do estágio corrente, lido no lugar da lista de passos. */
  readonly summaryKey = computed(() => stageLabelKey(STAGES[currentStep(this.job())]));
}
