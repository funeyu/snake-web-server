CREATE TABLE `snake`.`users`(
  `id` bigint(18) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `login` varchar(32) NOT NULL DEFAULT '' COMMENT 'git用户对应的登录名',
  `avatar` varchar(64) NOT NULL DEFAULT '' COMMENT 'git用户对应的头像',
  `is_admin` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否为admin用户',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_login` (`login`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户表';
