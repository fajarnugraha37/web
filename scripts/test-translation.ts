import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false;

async function test() {
  console.log('Loading pipeline...');
  const translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', {
    quantized: true,
  });

  const text = "namaku fajar, namaku fajar dan namaku fajar";

  console.log('Translating to English...');
  const en = await translator(text, { src_lang: 'ind_Latn', tgt_lang: 'eng_Latn' });
  console.log('EN:', JSON.stringify(en));

  console.log('Translating to Chinese...');
  const zh = await translator(text, { src_lang: 'ind_Latn', tgt_lang: 'zho_Hans' });
  console.log('ZH:', JSON.stringify(zh));

  console.log('Translating to Spanish...');
  const es = await translator(text, { src_lang: 'ind_Latn', tgt_lang: 'spa_Latn' });
  console.log('ES:', JSON.stringify(es));

  console.log('Translating to Arabic...');
  const ar = await translator(text, { src_lang: 'ind_Latn', tgt_lang: 'arb_Arab' });
  console.log('AR:', JSON.stringify(ar));
}

test().catch(console.error);
