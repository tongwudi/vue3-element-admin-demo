<template>
  <template v-if="!item.meta?.hidden">
    <!--【叶子节点】显示叶子节点或唯一子节点且父节点未配置始终显示 -->
    <el-menu-item
      v-if="hasOnlyChild(item.children, item)"
      :index="resolvePath(onlyOneChild.path)"
    >
      <!-- 菜单图标 -->
      <el-icon>
        <component :is="item.meta?.icon || 'Document'" />
      </el-icon>
      <!-- 菜单标题 -->
      <span v-if="onlyOneChild.meta?.title || item.meta?.title">
        {{ onlyOneChild.meta.title || item.meta?.title }}
      </span>
    </el-menu-item>

    <!--【非叶子节点】显示含多个子节点的父菜单，或始终显示的单子节点 -->
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <!-- 菜单图标 -->
        <el-icon>
          <component :is="item.meta?.icon || 'Document'" />
        </el-icon>
        <!-- 菜单标题 -->
        <span v-if="item.meta?.title">
          {{ item.meta.title }}
        </span>
      </template>

      <SidebarMenuItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :is-nest="true"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
  import path from 'path-browserify';
  import { isExternal } from '@/utils/index';

  defineOptions({
    name: 'SidebarMenuItem',
    inheritAttrs: false
  });

  const props = defineProps({
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String
    }
  });

  // 可见的唯一子节点
  const onlyOneChild = ref();

  /**
   * 检查是否仅有一个可见子节点
   *
   * @param children 子路由数组
   * @param parent 父级路由
   * @returns 是否仅有一个可见子节点
   */
  function hasOnlyChild(children = [], parent) {
    // 过滤出可见子节点
    const showingChildren = children.filter(route => {
      if (!route.meta?.hidden) {
        onlyOneChild.value = route;
        return true;
      }
      return false;
    });

    // 仅有一个节点
    if (showingChildren.length === 1) {
      return true;
    }

    // 无子节点时，父节点设置为唯一显示节点
    if (showingChildren.length === 0) {
      onlyOneChild.value = { ...parent, path: '' };
      return true;
    }
    return false;
  }

  /**
   * 获取完整路径，适配外部链接
   *
   * @param routePath 路由路径
   * @returns 绝对路径
   */
  function resolvePath(routePath) {
    if (isExternal(routePath)) return routePath;
    if (isExternal(props.basePath)) return props.basePath;
    // 拼接父路径和当前路径
    return path.resolve(props.basePath, routePath);
  }
</script>
