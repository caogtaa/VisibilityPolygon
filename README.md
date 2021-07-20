# VisibilityPolygon

#### 介绍
带洞多边形的可视多边形(visibility polygon)计算。使用Cocos Creator进行可视化。
[演示地址](https://caogtaa.github.io/VisibilityPolygonDemo/)


#### 语言 & 框架
* TypeScript
* Cocos Creator 2.4
* Mesh编辑采用了白玉无冰大佬的[MeshPolygonSprite](https://github.com/baiyuwubing/cocos-creator-examples.git)


#### 算法
查阅了一些资料，目前处理带洞多边形有3种可考虑的算法
1. Sweep line算法。无预处理，运行时O(Nlog(N))时间复杂度
2. Triangular Expansion算法。O(Nlog(N))预处理时间、空间复杂度，O(N^2)运行时时间复杂度。虽然理论复杂度高，但是由于是Output Sensitive算法，在实际应用中往往有极快速度
3. Planar Sight。O(N^2)预处理时间、空间复杂度，O(N)运行时时间复杂度

本工程目前采用的是Sweep line算法，实现最简单的一种。
Triangular Expansion算法收录于CGAL库中，后续考虑移植过来。
Planar Sight算法也是开源的，有兴趣的同学可以参考[Planar Sight](https://github.com/BichengLUO/PlanarSight)


#### 参考资料
* supersuraccoon大佬的[SSRLos库](https://gitee.com/supersuraccoon/ssrlos-cocoscreator_v2)，看了这个库后开始对实现产生兴趣
* [CGAL](https://github.com/CGAL/cgal)，强大的计算几何算法库
* [C++版sweep line实现](git@github.com:trylock/visibility.git)，实现部分的主要参考对象
* T. Asano. An efficient algorithm for finding the visibility polygon for a polygonal region with holes. IEICE Transactions (1976-1990), (9):557–559, 1985.
* Francisc Bungiu, Michael Hemmer, John Hershberger, Kan Huang, and Alexander Kröller. Efficient computation of visibility polygons. CoRR, abs/1403.3905, 2014.
* [Planar Sight实验报告](https://dsa.cs.tsinghua.edu.cn/~deng/cg/project/2015s/2015s-a.pdf)

