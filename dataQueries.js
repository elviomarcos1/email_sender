const documentos = `
SELECT 
    doc.cd_documento,
    doc.nm_documento,
    doc.cd_setor_atendimento AS setor_responsavel_documento,
    doc.nr_seq_tipo,
    doc.ds_palavra_chave,
    guser.nr_sequencia AS indice_grupo,
    guser.ds_grupo,
    cla.ds_classificacao,
    lib.dt_inicio_vigencia,
    lib.dt_fim_vigencia,
    ROUND((lib.dt_fim_vigencia - sysdate)) || ' dias' as dias_vencimento
FROM qua_documento doc
    JOIN qua_classif_doc cla ON doc.nr_seq_classif = cla.nr_sequencia
    JOIN qua_tipo_referencia ref ON doc.nr_seq_tipo_ref_doc = ref.nr_sequencia
    JOIN qua_doc_lib lib ON doc.nr_sequencia = lib.nr_seq_doc
    JOIN grupo_usuario guser ON lib.nr_seq_grupo_usuario = guser.nr_sequencia
    JOIN(SELECT nr_seq_doc, MAX(dt_inicio_vigencia) AS dt_inicio_vigencia
         FROM qua_doc_lib
          GROUP BY nr_seq_doc)
         ultima_liberacao ON lib.nr_seq_doc = ultima_liberacao.nr_seq_doc
            AND lib.dt_inicio_vigencia = ultima_liberacao.dt_inicio_vigencia
            AND doc.ie_situacao = 'A'
          WHERE doc.cd_setor_atendimento IN (152, 100)
            AND lib.nr_seq_grupo_usuario IN (3, 4, 5, 6, 7, 8, 9, 11)
            AND
          TRUNC(lib.dt_fim_vigencia) <= TRUNC(sysdate + 30)
`;

module.exports = {
    documentos
}