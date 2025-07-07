const documentos = `
SELECT 
    doc.cd_documento,
    doc.nm_documento,
    cla.ds_classificacao,
    lib.dt_inicio_vigencia,
    lib.dt_fim_vigencia,
    doc.cd_setor_atendimento,
    ROUND((lib.dt_fim_vigencia - sysdate)) || ' dias' as dias_vencimento
FROM qua_documento doc
JOIN qua_classif_doc cla ON doc.nr_seq_classif = cla.nr_sequencia
JOIN qua_doc_lib lib ON doc.nr_sequencia = lib.nr_seq_doc
JOIN(SELECT nr_seq_doc, MAX(dt_inicio_vigencia) AS dt_inicio_vigencia
      FROM qua_doc_lib
      GROUP BY nr_seq_doc)
      ultima_liberacao ON lib.nr_seq_doc = ultima_liberacao.nr_seq_doc
      AND lib.dt_inicio_vigencia = ultima_liberacao.dt_inicio_vigencia
    WHERE doc.cd_setor_atendimento IN (152, 100)
AND
    TRUNC(lib.dt_fim_vigencia) <= TRUNC(sysdate + 30)
AND 
    doc.ie_situacao = 'A'
`;

module.exports = {
    documentos
}