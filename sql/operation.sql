CREATE TABLE `snake`.`operations`(
  `id` bigint(18) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` bigint(18) NOT NULL DEFAULT 0 COMMENT '用户id',
  `doc_id` varchar(20) NOT NULL DEFAULT '' COMMENT '用户操作的文档id',
  `word` varchar(32) NOT NULL DEFAULT '' COMMENT '用户搜索的词条',
  `type` tinyint(2) NOT NULL DEFAULT 1 COMMENT '用户操作类型1: star, 2: unstar, 3: collect',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_doc_id` (`doc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户行为数据表';
