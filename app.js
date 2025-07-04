
    const findDocument = (
      `SELECT 
    doc.cd_documento,
    doc.nm_documento,   
    cla.ds_classificacao,
    lib.dt_inicio_vigencia,
    lib.dt_fim_vigencia,
    ROUND((lib.dt_fim_vigencia - sysdate)) || ' dias' as dias_vencimento
    FROM qua_documento doc, qua_classif_doc cla, qua_doc_lib lib
    WHERE  (doc.nr_sequencia = lib.nr_seq_doc
        AND
            doc.nr_seq_classif = cla.nr_sequencia)
    AND doc.cd_setor_atendimento IN (152, 100) 
    AND
    TRUNC(lib.dt_fim_vigencia) <= TRUNC(sysdate + 30)
    AND 
    doc.ie_situacao = 'A'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );